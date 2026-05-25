import Link from "next/link"
import Image from "next/image"

const stageLabel = {
    1: "ステージ１",
    2: "ステージ２",
    3: "ステージ３"
}

const getAllItems = async() => {
    const response = await fetch("/api/enemy/readall", {cache: "no-store"})
    const jsonData = await response.json()
    const allItems = jsonData.allItems
    return allItems
}

const ReadAllItems = async() => {
    const allItems = await getAllItems()
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
