"use client"
import Image from "next/image"  
import { useEffect, useState } from "react"
import Link from "next/link" 
import useAuth from "../../utils/useAuth"

const skillTypeLabel = {
    attack: "攻撃",
    defend: "防御",
    heal: "回復"
}

const ReadSingleItem = () => {
    
    const loginUserEmail = useAuth()

    const [singleItem, setSingleItem] = useState([])

    useEffect(() => {

        if(!loginUserEmail) return

        const getSingleItem = async() => {
            const response = await fetch(
                `/api/skill/readsingle?email=${loginUserEmail}`,
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
                <h1>{singleItem.title}</h1>
                <h2>タイプ：{skillTypeLabel[singleItem.type]}</h2>
                <h2>AP：{singleItem.cost}</h2>
                <h2>威力：{singleItem.power}</h2>
                <hr/>
                <p>{singleItem.description}</p>
                <div>
                    <Link href={`/skill/update/${singleItem._id}`}>スキル編集</Link>
                    <Link href={`/skill/delete/${singleItem._id}`}>スキル削除</Link>
                </div>
            </div>
            <Link href="/skill/readall">
                <h3>スキル一覧へ戻る</h3>
            </Link>
        </div>
    )
}

export default ReadSingleItem