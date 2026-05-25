"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation" 
import useAuth from "../../utils/useAuth"
import Link from "next/link" 

const CreateItem = () => {
    const [title, setTitle] = useState("")
    const [type, setType] = useState("attack")
    const [cost, setCost] = useState("1")
    const [power, setPower] = useState("")
    const [totalCost, setTotalCost] = useState("")
    const [description, setDescription] = useState("")

    const router = useRouter()
    const loginUserEmail = useAuth() 
    console.log(loginUserEmail)

    useEffect(() => {

        const effectCostMap = {
            attack: 1,
            defend: 1,
            heal: 2 
        }

        const calculatedCost =
            Number(power || 0) * Number(effectCostMap[type] || 1)
            - (Number(cost || 1) -1 ) * 10

        setTotalCost(calculatedCost)

    }, [power, cost, type])

    const handleSubmit = async(e) => {
        e.preventDefault() 

        if(totalCost > 20){
            alert("コストの上限を超えています")
            return
        }

        try{
            const response = await fetch("https://make-skills-ruby.vercel.app/api/skill/create", {
                method: "POST",
                headers: { 
                    "Accept": "application/json", 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    title: title,
                    type: type,
                    cost: cost,
                    power: power,
                    totalCost: totalCost,
                    description: description,
                    email: loginUserEmail
                })
            })
            const jsonData = await response.json()
            alert(jsonData.message)  
            router.push("/skill/readall") 
            router.refresh()
        }catch{
            alert("スキル作成失敗") 
        }
    }

    if(loginUserEmail){
        return (
            <div>
                <h1 className="page-title">スキル作成</h1>
                <form onSubmit={handleSubmit}>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" name="title" placeholder="スキル名" required/>
                    <select value={type} onChange={(e) => setType(e.target.value)} name="type" required>
                        <option value="attack">攻撃</option>
                        <option value="defend">防御</option>
                        <option value="heal">回復</option>
                    </select>
                    <select value={cost} onChange={(e) => setCost(Number(e.target.value))} name="cost" required>
                        <option value="1">AP：1</option>
                        <option value="2">AP：2</option>
                        <option value="3">AP：3</option>
                        <option value="4">AP：4</option>
                        <option value="5">AP：5</option>
                    </select>
                    <input value={power} onChange={(e) => setPower(e.target.value)} type="number" name="power" placeholder="威力" required/>
                    <p>現在コスト：{totalCost}/20</p>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} name="description" rows={15} placeholder="スキル説明" required></textarea>
                    <button>作成</button>
                </form>
                <Link href="/skill/readall">
                    <h3>スキル一覧へ戻る</h3>
                </Link>
            </div>
        )
    }  
}


export default CreateItem