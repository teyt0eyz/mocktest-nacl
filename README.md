# NaCl Lab — Interview Prep

เว็บฝึกตอบ **คำถามสัมภาษณ์ Lab NaCl** — static site ล้วน ไม่ต้อง build ไม่ต้องมี backend
วางบน GitHub Pages ได้ทันที

## 3 หัวข้อ

| หัวข้อ | เนื้อหา | จำนวน |
|---|---|---|
| 🌐 **Network Fundamentals & Troubleshooting** | OSI/TCP-IP, TCP/UDP, subnetting/VLSM, DNS/DHCP/ARP, routing, troubleshooting, design scenarios | 40 |
| ☁️ **Cloud Fundamentals & Architecture** | IaaS/PaaS/SaaS, scaling/HA, containers/K8s, CI-CD, IaC, CAP, system design, DR | 40 |
| ⌨️ **Basic Shell** | chmod/chown, ไฟล์/กระบวนการ, pipe/redirect, grep/find/sed/awk, ssh, cron, systemctl | 40 |

## ฟีเจอร์

- **สุ่มคำถามขึ้นกลางจอ** ตัวใหญ่ ชัด (ไม่ถามซ้ำจนกว่าจะครบทุกข้อ)
- **จับเวลาต่อข้อ** 45 / 90 / 120 / 180 วินาที หรือโหมดนับขึ้น (ไม่จับเวลา) — เตือนสีเมื่อใกล้หมด
- **แนวคำตอบ / ประเด็นที่ควรพูดถึง** กดดูเพื่อเทียบกับที่ตอบไปเอง
- **ปักธง (🚩 bookmark)** ข้อที่ยังไม่เข้าใจ เก็บใน localStorage (อยู่แม้ปิดเว็บ) + โหมด "ทบทวนเฉพาะที่ปักธง"
- **ย้อนกลับข้อก่อนหน้า** และ **ผังข้อ (⊞)** กดกระโดดข้ามข้อได้ แสดงสถานะ ปัจจุบัน/เคยดู/ปักธง
- **เลือกหัวข้อ** ฝึกทีละหัวข้อหรือรวมกัน
- **โหมดมืด** · คีย์ลัด `Space` ดูคำตอบ · `←`/`→` ก่อนหน้า/ถัดไป · `F` ปักธง · `P` พัก · รองรับมือถือ

## โครงสร้าง

```
index.html                 · หน้าเว็บ (setup / practice / summary)
assets/css/style.css       · ดีไซน์ระบบสีน้ำเงิน + โหมดมืด
assets/js/app.js           · ลอจิก: สุ่ม/จับเวลา/เฉลย
interview_questions.json   · คลังคำถาม 60 ข้อ + แนวคำตอบ
```

## รันในเครื่อง

```bash
python3 -m http.server 8000
# เปิด http://localhost:8000
```

> วิธีใช้: อ่านคำถาม → **พูดตอบออกเสียงให้ครบ** ภายในเวลา → กด "ดูแนวคำตอบ" เทียบ → ข้อถัดไป
> เนื้อหาเพื่อการเตรียมตัวสัมภาษณ์เท่านั้น
