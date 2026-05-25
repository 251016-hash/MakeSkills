"use client"
import Image from "next/image"  
import Link from "next/link" 
import { useEffect, useState } from "react"
import useAuth from "../../utils/useAuth"

const stageLabel = {
    1: "ステージ１",
    2: "ステージ２",
    3: "ステージ３"
}

const actionTypeLabel = {
    attack: "攻撃",
    defend: "防御",
    heal: "回復"
}

const actionIcon = {
    attack: "⚔️",
    defend: "🛡️",
    heal: "💚"
}

const ReadSingleItem = () => {
    
    const loginUserEmail = useAuth()
    
    const [singleItem, setSingleItem] = useState([])

    useEffect(() => {
        if(!loginUserEmail) return

        const getSingleItem = async() => {
            const response = await fetch(
                `/api/enemy/readsingle?email=${loginUserEmail}`,
                {
                    cache: "no-store"
                }
            )
            const jsonData = await response.json()
            setSingleItem(jsonData.singleItem)
        }
        getSingleItem()
    }, [loginUserEmail])
    
    if(!singleItem){
        return <h1>Loading...</h1>
    }
    return (
        <div className="grid-container-si">
            <div>
                <Image src={singleItem.image} width={750} height={500} alt="item-image" priority/>
            </div>
            <div>
                <h1>{singleItem.name}</h1>
                <h2>{singleItem.hp}</h2>
                <h2>{stageLabel[singleItem.stage]}</h2>
                {singleItem.actions.map((actions, index) => (
                    <div key={index}> 
                        <p>行動:{actionTypeLabel[actions.actionType]}{actionIcon[actions.actionType]}</p>
                        <p>威力: {actions.power}</p>
                    </div>
                ))}
                <div>
                    <Link href={`/enemy/update/${singleItem._id}`}>敵モブ編集</Link>
                    <Link href={`/enemy/delete/${singleItem._id}`}>敵モブ削除</Link>
                </div>
            </div>
            <Link href="/enemy/readall">
                <h3>敵モブ一覧へ戻る</h3>
            </Link>
        </div>
    )
}

export default ReadSingleItem