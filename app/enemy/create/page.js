"use client"
import { useState, } from "react"
import { useRouter } from "next/navigation" 
import useAuth from "../../utils/useAuth"
import Link from "next/link" 

const CreateItem = () => {
    const [name, setName] = useState("")
    const [hp, setHp] = useState("")
    const [image, setImage] = useState("")
    const [actions, setActions] = useState([])
    const [actionType, setActionType] = useState("attack")
    const [power, setPower] = useState("")
    const [stage, setStage] = useState("1")

    const router = useRouter()
    const loginUserEmail = useAuth() 
    console.log(loginUserEmail)
    
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

    const addAction = () => {
        if (!actionType || !power) {
            alert("行動と威力を入力してください")
            return
        }

        const newAction = {
            actionType,
            power
        }
        setActions([...actions, newAction])

        setPower("")
    }
    const removeAction = (index) => {
        const newActions = actions.filter((_, i) => i !== index)
        setActions(newActions)
    }

    const handleSubmit = async(e) => {
        e.preventDefault() 
        console.log("送信actions:", actions)
        if (actions.length === 0) {
            alert("行動を最低1つ追加してください")
            return
        }

        try{
            const response = await fetch("https://make-skills-ruby.vercel.app/api/enemy/create", {
                method: "POST",
                headers: { 
                    "Accept": "application/json", 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    name: name,
                    hp: hp,
                    image: image,
                    actions: actions,
                    email: loginUserEmail,
                    stage: stage,
                })
            })
            const jsonData = await response.json()
            alert(jsonData.message)  
            router.push("/enemy/readall") 
            router.refresh()
        }catch{
            alert("敵モブ作成失敗") 
        }
    }

    if(loginUserEmail == "admin@gmail.com"){
        return (
            <div>
                <h1 className="page-title">敵モブ作成</h1>
                <form onSubmit={handleSubmit}>
                    <input value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" placeholder="敵モブ名" required/>
                    <input value={hp} onChange={(e) => setHp(e.target.value)} type="number" name="hp" placeholder="体力" required/>
                    <input value={image} onChange={(e) => setImage(e.target.value)} type="text" name="image" placeholder="敵モブ画像" required/>
                    <select value={stage} onChange={(e) => setStage(e.target.value)} name="stage" required>
                        <option value="1">ステージ１</option>
                        <option value="2">ステージ２</option>
                        <option value="3">ステージ３</option>
                    </select>
                    <select value={actionType} onChange={(e) => setActionType(e.target.value)} name="actionType" required>
                        <option value="attack">攻撃</option>
                        <option value="defend">防御</option>
                        <option value="heal">回復</option>
                    </select>
                    <input value={power} onChange={(e) => setPower(e.target.value)} type="number" name="power" placeholder="威力" required/>
                    <button type="button" onClick={addAction}>行動保存</button>
                    <h3>現在の行動一覧</h3>
                    {
                        actions.map((action, index) => (
                            <div key={index}>
                                <p>行動:{actionTypeLabel[action.actionType]}{actionIcon[action.actionType]}</p>
                                <p>威力:{action.power}</p>
                                <button type="button" onClick={()=> removeAction(index)}>削除</button>
                            </div>
                        ))
                    }
                    <button>作成</button>
                </form>
                <Link href="/enemy/readall">
                    <h3>敵モブ一覧へ戻る</h3>
                </Link>
            </div>
        )
    }  
}


export default CreateItem