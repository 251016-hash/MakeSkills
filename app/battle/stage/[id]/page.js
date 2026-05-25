"use client"

import "../../../battle.css"
import { useEffect, useState } from "react"
import useAuth from "../../../utils/useAuth"
import { useRouter, useParams } from "next/navigation"

const max_ap = 5
const max_hp = 100

const BattlePage = () => {

    const router = useRouter()
    const loginUserEmail = useAuth()

    const [enemy, setEnemy] = useState(null)

    const [enemyHp, setEnemyHp] = useState(0)

    const [playerHp, setPlayerHp] = useState(100)
    const [playerAp, setPlayerAp] = useState(max_ap)

    const [skills, setSkills] = useState([])

    const [logs, setLogs] = useState([])

    const [turn, setTurn] = useState("player")

    const [playerShield, setPlayerShield] = useState(0)
    const [enemyShield, setEnemyShield] = useState(0)

    const [enemyNextAction, setEnemyNextAction] = useState(null)

    const params = useParams()

    const stage = Number(params.id)

    const [usedSkills, setUsedSkills] = useState([])

    useEffect(() => {
        const getRandomEnemy = async () => {
            const response = await fetch(`http://localhost:3000/api/battle/randomEnemy/${stage}`)
            const jsonData = await response.json()
            setEnemy(jsonData.randomEnemy)

            setEnemyHp(jsonData.randomEnemy.hp)
        }
        getRandomEnemy()
    }, [stage])

    useEffect(() => {
        if(!loginUserEmail) return
        getSkills()
    },[loginUserEmail])

    useEffect(() => {
        if (!enemy) return
        predictEnemyAction()
    }, [enemy])

    const getSkills = async() => {
        const response = await fetch(`https://make-skills-ruby.vercel.app/api/skill/readall?email=${loginUserEmail}`)
        const jsonData = await response.json()
        const shuffled = [...jsonData.allItems].sort(() => 0.5 - Math.random())
        setSkills(shuffled.slice(0, 5))
    }

    const useSkill = (skill) => {
        if(turn !== "player"){
            return
        }
        // AP不足
        if(playerAp < skill.cost){
            alert("APが足りません")
            return
        }
        if(usedSkills.includes(skill._id)){
            alert("このターンではもう使えません")
            return
        }
        // AP消費
        setPlayerAp(playerAp - skill.cost)
        // 攻撃
        if(skill.type === "attack"){
            let damage = skill.power
            if(enemyShield > 0){
                if(enemyShield >= damage){
                    // シールドで全部防ぐ
                    setEnemyShield(prev => prev - damage)
                    damage = 0
                } else {
                    // シールドを破壊して残りがHPへ
                    damage = damage - enemyShield
                    setEnemyShield(0)
                }
            }
            setEnemyHp(prev => prev - damage)
            setLogs(prev => [
                ...prev,
                `${skill.title}！ 敵に${damage}ダメージ！`
            ])
        }
        // 回復
        if(skill.type === "heal"){
            setPlayerHp(prev => Math.min(prev + skill.power, max_hp))
            setLogs(prev => [
                ...prev,
                `${skill.title}！ ${skill.power}回復！`
            ])
        }
        // 防御
        if(skill.type === "defend"){
            setPlayerShield(prev => prev + skill.power)

            setLogs(prev => [
                ...prev,
                `${skill.title}！ シールド ${skill.power} 展開！`
            ])
        }
        setUsedSkills(prev => [...prev, skill._id])
    }
    const endTurn = () => {
        // 敵ターンへ
        setTurn("enemy")
        setLogs(prev => [
            ...prev,
            "ターン終了"
        ])
        setEnemyShield(0)
        // 少し待って敵行動
        setTimeout(() => {
            enemyAction()
        }, 1000)
    }
    const predictEnemyAction = () => {
        if (!enemy) return

        const action =
            enemy.actions[
                Math.floor(Math.random() * enemy.actions.length)
            ]

        setEnemyNextAction(action)
    }

    const enemyAction = () => {
        if(!enemy) return
        // ランダム行動
        const enemyAction = enemyNextAction
        // 攻撃
        if(enemyAction.actionType === "attack"){
            let damage = enemyAction.power
            if(playerShield > 0){

                if(playerShield >= damage){
                    setPlayerShield(prev => prev - damage)
                    damage = 0
                } else {
                    damage = damage - playerShield
                    setPlayerShield(0)
                }
            }
            if(damage > 0){
                setPlayerHp(prev => prev - damage)
            }
            setLogs(prev => [
                ...prev,
                `${enemy.name}の攻撃！`,
                `${damage}ダメージ受けた！`
            ])
        }
        // 回復
        if(enemyAction.actionType === "heal"){
            setEnemyHp(prev => prev + enemyAction.power)
            setLogs(prev => [
                ...prev,
                `${enemy.name}は回復した！`,
                `${enemyAction.power}回復！`
            ])
        }
        // 防御
        if(enemyAction.actionType === "defend"){
            setEnemyShield(enemyAction.power)
            setLogs(prev => [
                ...prev,
                `${enemy.name}はシールドを展開した！`
            ])
        }
        // AP全回復
        setPlayerAp(max_ap)
        setUsedSkills([])
        // プレイヤーターンへ
        setTurn("player")
        setLogs(prev => [
            ...prev,
            "プレイヤーターン"
        ])
        getSkills()
        setPlayerShield(0)
        predictEnemyAction()
    }
    const nextStage = async () => {
        router.push(`/battle/stage/${stage + 1}`)
    }
    useEffect(() => {
        if(enemyHp <= 0 && enemy){
            alert("勝利！次のステージへ！")
            nextStage()
        }
    }, [enemyHp])
    useEffect(() => {
        if(playerHp <= 0){
            alert("敗北...")
            router.push("/") // トップへ
        }
    }, [playerHp])

    if (!enemy) {
        return <h1>Loading...</h1>
    }
    return (
    <div className="rpg-container">

        {/* 上部分 */}
        <div className="battle-main">

            {/* 左側 */}
            <div className="left-panel">

                {/* 敵情報 */}
                <div className="status-box enemy-box">
                    <h2>{enemy.name}</h2>

                    <p>HP : {enemyHp}</p>
                    <p>シールド : {enemyShield}</p>

                    <div className="next-action">
                        <h3>次の行動</h3>

                        {
                            enemyNextAction && (
                                <>
                                    <p>{enemyNextAction.actionType}</p>
                                    <p>{enemyNextAction.power}</p>
                                </>
                            )
                        }
                    </div>
                </div>

                {/* プレイヤー情報 */}
                <div className="status-box player-box">
                    <h2>プレイヤー</h2>

                    <p>HP : {playerHp}</p>
                    <p>AP : {playerAp}</p>
                    <p>シールド : {playerShield}</p>

                    <button
                        className="battle-button"
                        onClick={endTurn}
                        disabled={turn !== "player"}
                    >
                        ターン終了
                    </button>

                    <button
                        className="battle-button"
                        onClick={() => router.push("/")}
                    >
                        トップへ戻る
                    </button>
                </div>
            </div>

            {/* 真ん中 */}
            <div className="center-panel">

                <div className="enemy-image-box">
                    <img
                        src={enemy.image}
                        alt={enemy.name}
                        className="enemy-image"
                    />
                </div>

                <h1 className="stage-title">
                    STAGE {stage}
                </h1>

                <h2 className="turn-title">
                    {turn === "player"
                        ? "PLAYER TURN"
                        : "ENEMY TURN"}
                </h2>
            </div>

            {/* 右側 */}
            <div className="log-panel">

                <h2>戦闘ログ</h2>

                <div className="log-box">

                    {
                        [...logs].reverse().map((log, index) => (
                            <p key={index}>{log}</p>
                        ))
                    }

                </div>
            </div>
        </div>

        {/* 下部分 */}
        <div className="skill-panel">

            {
                skills.map(skill => (

                    <div
                        key={skill._id}
                        className="skill-card"
                    >

                        <h3>{skill.title}</h3>

                        <p>{skill.type}</p>

                        <p>AP : {skill.cost}</p>

                        <p>威力 : {skill.power}</p>

                        <button
                            className="skill-button"
                            onClick={() => useSkill(skill)}
                            disabled={usedSkills.includes(skill._id)}
                        >
                            {
                                usedSkills.includes(skill._id)
                                ? "使用済み"
                                : "使用"
                            }
                        </button>

                    </div>
                ))
            }

        </div>

    </div>

    )
}

export default BattlePage