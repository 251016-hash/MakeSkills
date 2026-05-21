"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation" 
import Image from "next/image"
import useAuth from "../../../utils/useAuth"
import Link from "next/link" 

const DeleteItem = (context) => { //(context)を{params}に変える場合 const resolvedPrams = use(params)が必要
    const [title, setTitle] = useState("")
    const [type, setType] = useState("")
    const [cost, setCost] = useState("")
    const [power, setPower] = useState("")
    const [description, setDescription] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    const router = useRouter()
    const loginUserEmail = useAuth() 

    useEffect(() => {
        const getSingleItem = async() => {
            const resolvedParams = await context.params
            const response = await fetch(`http://localhost:3000/api/skill/readsingle/${resolvedParams.id}`, {cache: "no-store"})
            const jsonData = await response.json() 
            const singleItem = jsonData.singleItem
            setTitle(singleItem.title)
            setType(singleItem.type)
            setCost(singleItem.cost)
            setPower(singleItem.power)
            setDescription(singleItem.description)
            setEmail(singleItem.email) 
            setLoading(true)
        }  
        getSingleItem() 
    }, [context]) 

    const handleSubmit = async(e) => {
        e.preventDefault() 
        try{
            const resolvedParams = await context.params
            const response = await fetch(`http://localhost:3000/api/skill/delete/${resolvedParams.id}`, {
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
            router.push("/skill/readall") 
            router.refresh()
        }catch{
            alert("スキル削除失敗") 
        }
    }
    if(loading){
        if(loginUserEmail === email){ 
            return (
                <div>
                    <h1 className="page-title">スキル削除</h1>
                    <form onSubmit={handleSubmit}>
                        <h2>{title}</h2>
                        <h3>{type}</h3>
                        <h3>AP{cost}</h3>
                        <h3>{power}</h3>
                        <p>{description}</p>
                        <button>削除</button>
                    </form>
                    <Link href="/skill/readall">
                        <h3>スキル一覧へ戻る</h3>
                    </Link>
                </div>
            )   
        }else{                 
            return <h1>権限がありません</h1> 
        }
    }else{
        return <h1>ローディング中...</h1>
    }
}

export default DeleteItem