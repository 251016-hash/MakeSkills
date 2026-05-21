"use client"

import Link from "next/link"
import useAuth from "./utils/useAuth"


const Home = () => {

    const loginUserEmail = useAuth() 

    return (
        <div className="grid-container-in">
                <Link href="/user/login/">
                    <div> 
                        <h2>ユーザーの変更</h2>
                    </div>
                </Link>
                <Link href="/skill/readall/">
                    <div> 
                        <h2>スキル一覧</h2>
                    </div>
                </Link>
                <Link href="/battle/stage/1">
                    <div> 
                        <h2>バトルスタート</h2>
                    </div>
                </Link>
            {
                loginUserEmail === "admin@gmail.com" && (
                <Link href="/enemy/readall">
                    <div>
                        <h2>敵モブ一覧</h2>
                    </div>
                </Link>
                )
            }
        </div>
    )
} 

export default Home