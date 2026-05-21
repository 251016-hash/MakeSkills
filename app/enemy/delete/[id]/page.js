"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation" 
import Image from "next/image"
import useAuth from "../../../utils/useAuth"
import Link from "next/link" 

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

const DeleteItem = (context) => {
    const [name, setName] = useState("")
    const [hp, setHp] = useState("")
    const [image, setImage] = useState("")
    const [actions, setActions] = useState([])
    const [email, setEmail] = useState("")
    const [stage, setStage] = useState("")
    const [loading, setLoading] = useState(false)

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

    const handleSubmit = async(e) => {
        e.preventDefault() 
        try{
            const resolvedParams = await context.params
            const response = await fetch(`http://localhost:3000/api/enemy/delete/${resolvedParams.id}`, {
                method: "DELETE",
                headers: { 
                    "Accept": "application/json", 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ 
                    email: loginUserEmail
                })
            })
            const jsonData = await response.json()
            alert(jsonData.message)  
            router.push("/enemy/readall") 
            router.refresh()
        }catch{
            alert("敵モブ削除失敗") 
        }
    }
    if(loading){
            return (
                <div>
                    <h1 className="page-title">敵モブ削除</h1>
                    <form onSubmit={handleSubmit}>
                        <h2>{name}</h2>
                        <h3>{hp}</h3>
                        {image &&(
                            <Image src={image} width={750} height={500} alt="enemy-image" priority/>
                        )}
                        <h3>{stageLabel[stage]}</h3>
                        <h3>行動一覧</h3>
                        {actions.map((action, index) => (
                            <div key={index}>
                                <p>行動:{actionTypeLabel[action.actionType]}{actionIcon[action.actionType]}</p>
                                <p>威力: {action.power}</p>
                            </div>
                        ))}
                        <button>削除</button>
                    </form>
                    <Link href="/enemy/readall">
                        <h3>敵モブ一覧へ戻る</h3>
                    </Link>
                </div>
            )   
    }else{
        return <h1>ローディング中...</h1>
    }
}

export default DeleteItem