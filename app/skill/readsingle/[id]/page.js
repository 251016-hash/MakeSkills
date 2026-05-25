import Image from "next/image"  
import Link from "next/link" 

const skillTypeLabel = {
    attack: "攻撃",
    defend: "防御",
    heal: "回復"
}

const getSingleItem = async(id) => {
    const response = await fetch(`https://make-skills-ruby.vercel.app/api/skill/readsingle/${id}`, {cache: "no-store"})
    const jsonData = await response.json() 
    const singleItem = jsonData.singleItem
    return singleItem 
}  

const ReadSingleItem = async(context) => {
    const resolvedParams = await context.params
    const singleItem = await getSingleItem(resolvedParams.id)
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