"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import useAuth from "../../utils/useAuth"

const stageLabel = {
    1: "ステージ１",
    2: "ステージ２",
    3: "ステージ３"
}

const ReadAllItems = () => {

    const loginUserEmail = useAuth()
    const [allItems, setAllItems] = useState([])
    
    useEffect(() => {
        if(!loginUserEmail) return
        const getAllItems = async() => {
            const response = await fetch(
                `/api/enemy/readall?email=${loginUserEmail}`,
                {
                    cache: "no-store"
                }
            )
            const jsonData = await response.json()
            setAllItems(jsonData.allItems)
        }
        getAllItems()
    }, [loginUserEmail])
    return (
        <div>
            <div className="top-buttons">
                <Link href="/enemy/create" className="menu-button create-button">敵モブ作成</Link>
                <Link href="/" className="menu-button back-button">トップへ戻る</Link>
            </div>
            <div className="grid-container-in">
                {allItems.map(enemy => 
                    <Link href={`/enemy/readsingle/${enemy._id}`} key={enemy._id}>
                        <Image src={enemy.image} width={750} height={500} alt="item-image" priority/>
                        <div> 
                            <h2>{enemy.name}</h2>
                            <h3>{enemy.hp}</h3>
                            <h3>{stageLabel[enemy.stage]}</h3>
                        </div>
                    </Link>
                )}
            </div>
        </div>
    )
} 

export default ReadAllItems
