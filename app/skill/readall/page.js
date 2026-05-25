"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import useAuth from "../../utils/useAuth"

const skillTypeLabel = {
    attack: "攻撃",
    defend: "防御",
    heal: "回復"
}

const ReadAllItems = () => {

    const loginUserEmail = useAuth()

    const [allItems, setAllItems] = useState([])

    useEffect(() => {

        if(!loginUserEmail) return

        const getAllItems = async() => {

            const response = await fetch(
                `https://make-skills-ruby.vercel.app/api/skill/readall?email=${loginUserEmail}`,
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
                <Link href="/skill/create" className="menu-button create-button">スキル作成</Link>
                <Link href="/" className="menu-button back-button">トップへ戻る</Link>
            </div>
        <div className="grid-container-in">
            {allItems.map(skill => 
                <Link href={`/skill/readsingle/${skill._id}`} key={skill._id}>
                    <div> 
                        <h2>{skill.title}</h2>
                        <h3>{skillTypeLabel[skill.type]}</h3>
                        <h3>AP{skill.cost}</h3>
                        <h3>{skill.power}</h3>
                        <p>{skill.description.substring(0, 80)}...</p>  
                    </div>
                </Link>
            )}
        </div>
        </div>
    )
}
export default ReadAllItems
