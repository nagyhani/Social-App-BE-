import crypto, {createCipheriv } from "node:crypto"


export function encrypt(plaintext:string){

    const iv = crypto.randomBytes(16)
    const cipher = createCipheriv("aes-256-cbc",
        Buffer.from("23186468454648784165136846876115"),
        iv
    )

    let encryptedData = cipher.update(plaintext,"utf-8","hex")
    encryptedData += cipher.final("hex")

    return `${iv.toString("hex")}:$${encryptedData}`

}


export function decrypt(encryptedData:string){

    const [iv,encryptedValue] = encryptedData.split(":")
    const ivBinaryLike = Buffer.from(iv as string,"hex")
    const decipher = crypto.createDecipheriv("aes-256-cbc",
        Buffer.from("23186468454648784165136846876115"),
        ivBinaryLike
    )

    let decryptedData = decipher.update(encryptedValue as string,"hex" , "utf-8")
    decryptedData += decipher.final("utf-8")

    return decryptedData
}