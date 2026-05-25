"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation" 
import useAuth from "../../../utils/useAuth"
import Link from "next/link" 

const stageLabel = {
    1: "ステージ１",
    2: "ステージ２",
    3: "ステージ３"
}

const UpdateItem = (context) => {
    const [name, setName] = useState("")
    const [hp, setHp] = useState("")
    const [image, setImage] = useState("")
    const [actions, setActions] = useState([])
    const [stage, setStage] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    const [actionType, setActionType] = useState("attack")
    const [power, setPower] = useState("")

    const router = useRouter()
    const loginUserEmail = useAuth() 

    useEffect(() => {
        const getSingleItem = async() => {
            const resolvedParams = await context.params
            const response = await fetch(`http://localhost:3000/api/enemy/readsingle/${resolvedParams.id}`, {cache: "no-store"})
            const jsonData = await response.json() 
            const singleItem = jsonData.singleItem
            setName(singleItem.name)
            setHp(singleItem.hp)
            setImage(singleItem.image)
            setActions(singleItem.actions || [])
            setStage(singleItem.stage) 
            setEmail(singleItem.email) 
            setLoading(true)
        } 
        getSingleItem() 
    }, [context]) 

    const addAction = () => {
        if (!actionType || !power) {
            alert("行動と威力を入力してください")
            return
        }

        const newAction = {
            actionType,
            power: power
        }

        setActions([...actions, newAction])

        setActionType("attack")
        setPower("")
    }

    const updateAction = (index, field, value) => {
        const newActions = [...actions]

        newActions[index][field] =
            field === "power" ? Number(value) : value

        setActions(newActions)
    }

    const removeAction = (index) => {
        const newActions = actions.filter((_, i) => i !== index)
        setActions(newActions)
    }

    const handleSubmit = async(e) => {
        e.preventDefault() 
        try{
            const resolvedParams = await context.params
            const response = await fetch(`https://make-skills-ruby.vercel.app/api/enemy/update/${resolvedParams.id}`, {
                method: "PUT",
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
                    stage: stage,
                    email: loginUserEmail
                })
            })
            const jsonData = await response.json()
            alert(jsonData.message)  
            router.push("/enemy/readall") 
            router.refresh()
        }catch{
            alert("敵モブ編集失敗") 
        }
    }
    if(loading){
        console.log(actions)
            return (
                <div>
                    <h1 className="page-title">敵モブ編集</h1>
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
                                    <select value={action.actionType} onChange={(e) => updateAction(index, "actionType", e.target.value)} name="actionType" required>
                                        <option value="attack">攻撃</option>
                                        <option value="defend">防御</option>
                                        <option value="heal">回復</option>
                                    </select>
                                    <input value={action.power} onChange={(e) => updateAction(index, "power", e.target.value)} type="number" name="power" placeholder="威力" required/>
                                    <button type="button" onClick={()=> removeAction(index)}>削除</button>
                                </div>
                            ))
                        }
                        <button>作成</button>
                    </form>
                    <Link href="/enemy/readall">
                        <h3>スキル一覧へ戻る</h3>
                    </Link>
                </div>
            )
    }else{
        return <h1>ローディング中...</h1>
    }
}

export default UpdateItem