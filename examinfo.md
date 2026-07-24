# NACL Theory Round — ชีตติวเข้าห้องสอบ (Exam Cram Sheet)

> อ้างอิงหัวข้อจาก [blueprint.md](blueprint.md) · ครอบคลุมทั้ง 8 หมวด/ทุกเนื้อหาย่อย
> เป้าหมาย: หยิบใช้ระหว่างทำข้อสอบได้ทันที (สูตร + ตารางลัด + คำศัพท์)

## สารบัญ
1. [ตารางลัดที่ใช้บ่อยสุด (เปิดหน้านี้ก่อน)](#0-ตารางลัดที่ใช้บ่อยสุด)
2. [หมวด 1 — พื้นฐานระบบคอมพิวเตอร์](#หมวด-1--พื้นฐานระบบคอมพิวเตอร์)
3. [หมวด 2 — ระบบเลขฐาน & คณิตในคอมพิวเตอร์](#หมวด-2--ระบบเลขฐาน--คณิตในคอมพิวเตอร์)
4. [หมวด 3 — ภาษาซี](#หมวด-3--ภาษาซี)
5. [หมวด 4 — คณิตศาสตร์ประยุกต์](#หมวด-4--คณิตศาสตร์ประยุกต์)
6. [หมวด 5 — ระบบเครือข่าย (85 คะแนน!)](#หมวด-5--ระบบเครือข่าย)
7. [หมวด 6 — Cloud Computing](#หมวด-6--cloud-computing)
8. [หมวด 7 — เทคโนโลยีทั่วไป](#หมวด-7--เทคโนโลยีทั่วไป)
9. [หมวด 8 — เชาว์ & ตรรกะ](#หมวด-8--เชาว์--ตรรกะ)
10. [อภิธานศัพท์ (Glossary)](#อภิธานศัพท์-glossary)

---

## 0. ตารางลัดที่ใช้บ่อยสุด

### เลขยกกำลังของ 2
| n | 2ⁿ | n | 2ⁿ | n | 2ⁿ |
|--:|--:|--:|--:|--:|--:|
| 0 | 1 | 8 | 256 | 16 | 65,536 |
| 1 | 2 | 9 | 512 | 17 | 131,072 |
| 2 | 4 | 10 | 1,024 | 18 | 262,144 |
| 3 | 8 | 11 | 2,048 | 19 | 524,288 |
| 4 | 16 | 12 | 4,096 | 20 | 1,048,576 (1M) |
| 5 | 32 | 13 | 8,192 | 24 | 16,777,216 |
| 6 | 64 | 14 | 16,384 | 30 | 1,073,741,824 (1G) |
| 7 | 128 | 15 | 32,768 | 32 | 4,294,967,296 (4G) |

**หน่วยข้อมูล:** 2¹⁰=1 KiB, 2²⁰=1 MiB, 2³⁰=1 GiB, 2⁴⁰=1 TiB · 1 byte = 8 bit · 1 nibble = 4 bit

### ตาราง Subnet Mask (จำให้ได้!)
สูตร: **จำนวน host ใช้งานได้ = 2^(32−prefix) − 2** · **จำนวน subnet เมื่อยืม k บิต = 2ᵏ** · **block size = 256 − ค่า mask ของ octet นั้น**

| CIDR | Subnet Mask | Wildcard | Host ใช้ได้ | Block |
|--:|---|---|--:|--:|
| /24 | 255.255.255.0 | 0.0.0.255 | 254 | 256 |
| /25 | 255.255.255.128 | 0.0.0.127 | 126 | 128 |
| /26 | 255.255.255.192 | 0.0.0.63 | 62 | 64 |
| /27 | 255.255.255.224 | 0.0.0.31 | 30 | 32 |
| /28 | 255.255.255.240 | 0.0.0.15 | 14 | 16 |
| /29 | 255.255.255.248 | 0.0.0.7 | 6 | 8 |
| /30 | 255.255.255.252 | 0.0.0.3 | 2 | 4 |
| /31 | 255.255.255.254 | 0.0.0.1 | 0 (point-to-point, RFC3021) | 2 |
| /32 | 255.255.255.255 | 0.0.0.0 | 1 (host route) | 1 |
| /23 | 255.255.254.0 | 0.0.1.255 | 510 | 512 |
| /22 | 255.255.252.0 | 0.0.3.255 | 1,022 | 1,024 |
| /21 | 255.255.248.0 | 0.0.7.255 | 2,046 | 2,048 |
| /20 | 255.255.240.0 | 0.0.15.255 | 4,094 | 4,096 |
| /19 | 255.255.224.0 | 0.0.31.255 | 8,190 | 8,192 |
| /18 | 255.255.192.0 | | 16,382 | 16,384 |
| /17 | 255.255.128.0 | | 32,766 | 32,768 |
| /16 | 255.255.0.0 | 0.0.255.255 | 65,534 | 65,536 |
| /8 | 255.0.0.0 | 0.255.255.255 | 16,777,214 | — |

**ค่าบิตของ mask octet:** 128 → `10000000`, 192 → `11000000`, 224 → `11100000`, 240 → `11110000`, 248 → `11111000`, 252 → `11111100`, 254 → `11111110`, 255 → `11111111`

### เลขฐานสิบหก ↔ ฐานสอง (4 บิต)
| Hex | Bin | Dec | Hex | Bin | Dec |
|--|--|--|--|--|--|
| 0 | 0000 | 0 | 8 | 1000 | 8 |
| 1 | 0001 | 1 | 9 | 1001 | 9 |
| 2 | 0010 | 2 | A | 1010 | 10 |
| 3 | 0011 | 3 | B | 1011 | 11 |
| 4 | 0100 | 4 | C | 1100 | 12 |
| 5 | 0101 | 5 | D | 1101 | 13 |
| 6 | 0110 | 6 | E | 1110 | 14 |
| 7 | 0111 | 7 | F | 1111 | 15 |

### ASCII ที่ต้องจำ
`'0'` = 48 (0x30) · `'A'` = 65 (0x41) · `'a'` = 97 (0x61) · space = 32 · `'a'−'A'` = 32 · null `\0` = 0 · `'9'`=57, `'Z'`=90, `'z'`=122

---

## หมวด 1 — พื้นฐานระบบคอมพิวเตอร์
**(20 คะแนน · ปรนัย 10)**

### 1.1 พื้นฐานระบบดิจิทัล
- **ลอจิกเกต:** AND (ทั้งคู่ 1), OR (มี 1), NOT (กลับ), NAND, NOR, XOR (ต่างกัน=1), XNOR (เหมือนกัน=1)
- **Universal gate:** NAND และ NOR สร้างเกตอื่นได้ทุกตัว
- **ตัวเลขในดิจิทัล:** combinational (ผลขึ้นกับ input ปัจจุบัน) vs sequential (มี memory/สถานะ เช่น flip-flop)
- **Flip-flop:** SR, D, JK, T — เก็บ 1 บิต · latch = level-triggered, flip-flop = edge-triggered
- **วงจร combinational สำคัญ:**
  - **Half Adder:** Sum = A⊕B, Carry = A·B · **Full Adder:** บวก 3 บิต (A,B,Cin)
  - **MUX (Multiplexer):** เลือก 1 จากหลาย input ด้วย n select line → รับได้ 2ⁿ input · **DEMUX** ตรงข้าม
  - **Decoder:** n input → 2ⁿ output (เปิดทีละเส้น) · **Encoder** ตรงข้าม (2ⁿ→n)
- **พีชคณิตบูลีน (ลดรูปวงจร):**
  - Identity `A+0=A, A·1=A` · Null `A+1=1, A·0=0` · Idempotent `A+A=A, A·A=A`
  - Complement `A+A'=1, A·A'=0` · Double `A''=A` · **Absorption** `A+A·B=A`, `A+A'·B=A+B`
  - **De Morgan:** `(A·B)' = A'+B'` ; `(A+B)' = A'·B'`
- **K-map:** ลดรูป SOP โดยจับกลุ่ม 1 ที่ติดกันเป็นกำลังของ 2 (1,2,4,8) ให้ใหญ่ที่สุด

### 1.2 ฮาร์ดแวร์ของคอมพิวเตอร์
- **CPU** = ALU (คำนวณ) + CU (ควบคุม) + Register
- **Register สำคัญ:** PC (Program Counter), IR (Instruction Register), MAR/MDR, ACC, SP (Stack Pointer)
- **Bus 3 ชนิด:** Address bus (ระบุตำแหน่ง), Data bus (ข้อมูล), Control bus (สัญญาณควบคุม)
- **Von Neumann:** เก็บคำสั่ง+ข้อมูลในหน่วยความจำเดียว (คอขวด Von Neumann) · **Harvard:** แยกหน่วยความจำคำสั่ง/ข้อมูล
- **RAID:** 0=stripe (เร็ว ไม่ปลอดภัย), 1=mirror, 5=stripe+parity (usable=(n−1)×cap), 6=double parity ((n−2)×cap), 10=mirror+stripe (n×cap/2)

### 1.3 พื้นฐาน Cyber Security
- **CIA Triad:** Confidentiality (ความลับ) · Integrity (ความถูกต้อง) · Availability (พร้อมใช้งาน)
- **AAA:** Authentication (คุณเป็นใคร) · Authorization (มีสิทธิทำอะไร) · Accounting (บันทึกกิจกรรม)
- **การเข้ารหัส:** symmetric (กุญแจเดียว, AES/DES) vs asymmetric (คู่กุญแจ public/private, RSA)
- **Hashing:** ทางเดียว (one-way) — MD5(128), SHA-1(160), SHA-256(256) · เก็บรหัสผ่านเป็น **hash + salt**
- **การโจมตี:** SQL Injection (ใช้ prepared statement กัน), XSS, CSRF, DDoS (ถล่มทราฟฟิก), MITM, Phishing, Brute-force, Ransomware
- **หลักการ:** Least Privilege, Defense in Depth, Zero Trust (never trust, always verify), MFA
- **Malware:** Virus (ต้องพาหะ), Worm (แพร่เอง), Trojan (ปลอมตัว), Rootkit, Spyware

**ไทม์ไลน์เหตุการณ์ไซเบอร์สำคัญ (ออกในข้อสอบ):**
| ปี | เหตุการณ์ | จำไว้ |
|--|--|--|
| 1971 | **Creeper** | ไวรัสคอมพิวเตอร์ตัวแรก (เชิงทดลอง บน ARPANET) |
| 1988 | **Morris Worm** | worm ตัวแรกที่แพร่วงกว้างบนอินเทอร์เน็ต |
| 1999 | Melissa | macro virus ในเอกสาร Word แพร่ผ่านอีเมล |
| 2000 | **ILOVEYOU** | หนอนอีเมลไฟล์แนบ สร้างความเสียหายทั่วโลก |
| 2010 | **Stuxnet** | โจมตี SCADA/PLC โครงการนิวเคลียร์อิหร่าน |
| 2014 | Heartbleed | ช่องโหว่ใน **OpenSSL** |
| 2016 | **Mirai** | botnet จากอุปกรณ์ IoT → DDoS ขนาดใหญ่ |
| 2017 | **WannaCry** | ransomware ใช้ช่องโหว่ **EternalBlue (SMB)** |
| 2017 | NotPetya / Equifax | wiper ปลอมเป็น ransomware / ข้อมูลรั่วเพราะไม่แพตช์ Apache Struts |
| 2020 | **SolarWinds** | supply chain attack (ฝังโค้ดในอัปเดต) |
| 2021 | **Log4Shell** / Colonial Pipeline | RCE ในไลบรารี **Log4j** / ท่อน้ำมันหยุดเพราะ ransomware |
- **บุคคล/ของสำคัญ:** Alan Turing (ถอดรหัส Enigma WWII) · Kevin Mitnick (แฮกเกอร์ social engineering) · Trojan ตั้งชื่อตามม้าไม้เมืองทรอย

### 1.4 ระบบปฏิบัติการ (OS)
- **หน้าที่:** จัดการ process, memory, file system, I/O, ความปลอดภัย
- **Process vs Thread:** process แยก memory · thread แชร์ memory ใน process เดียว (เบากว่า ระวัง race condition)
- **Process states:** New → Ready → Running → Waiting → Terminated
- **CPU Scheduling:** FCFS, SJF (สั้นก่อน), Round Robin (time quantum, เป็นธรรม), Priority, MLFQ
- **Deadlock 4 เงื่อนไข (Coffman):** Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait (ตัดข้อใดข้อหนึ่งได้ = กัน deadlock)
- **Race condition** แก้ด้วย mutex/semaphore (critical section)
- **Virtual memory:** paging (เพจขนาดคงที่), page fault, TLB, thrashing

### 1.5 Input/Output Loop
- **3 วิธี I/O:** Programmed I/O (polling/busy-wait), Interrupt-driven (แจ้งเมื่อพร้อม), DMA (ย้ายข้อมูลตรงโดยไม่ผ่าน CPU ทุกไบต์)
- **Interrupt:** CPU หยุดงานปัจจุบัน → เรียก ISR (Interrupt Service Routine) → กลับมาทำงานต่อ

### 1.6 สถาปัตยกรรมคอมพิวเตอร์ (ISA)
- **Instruction Cycle:** Fetch → Decode → Execute → (Memory) → Write-back
- **Pipeline (5 stage):** IF → ID → EX → MEM → WB · เพิ่ม throughput
- **Hazards:** Structural (แย่งทรัพยากร), Data (พึ่งผลลัพธ์ — แก้ด้วย forwarding), Control (branch — แก้ด้วย prediction)
- **RISC** (คำสั่งง่าย ยาวคงที่ เช่น ARM) vs **CISC** (คำสั่งซับซ้อน เช่น x86)
- **Amdahl's Law:** `Speedup = 1 / ((1−p) + p/s)` เมื่อ p=สัดส่วนที่เร่งได้, s=อัตราเร่ง
- **MIPS** = ความถี่(MHz) / CPI · **CPI** = clock cycles per instruction

### 1.7 ลำดับชั้นหน่วยความจำ (Memory Hierarchy)
เร็ว→ช้า / แพง→ถูก: **Register → Cache (L1<L2<L3) → RAM → SSD/Disk → Tape**
- **Locality:** Temporal (ใช้ซ้ำเร็ว ๆ) · Spatial (ใช้ตำแหน่งใกล้กัน)
- **Cache mapping:** Direct, Fully associative, Set associative (จำนวน set = บล็อก/way)
- **สูตร Effective Access Time:** `EAT = h·Tc + (1−h)·(Tc+Tm)` (h=hit ratio)
- **Write policy:** write-through vs write-back

---

## หมวด 2 — ระบบเลขฐาน & คณิตในคอมพิวเตอร์
**(10 คะแนน · ปรนัย 5)**

### 2.1 การแปลงเลขฐาน
- **ฐาน r → ฐาน 10:** คูณค่าประจำหลัก `Σ digit × rⁱ`
- **ฐาน 10 → ฐาน r:** หารเอาเศษ (อ่านเศษจากล่างขึ้นบน)
- **ฐาน 2 ↔ 8:** จับกลุ่มละ 3 บิต · **ฐาน 2 ↔ 16:** จับกลุ่มละ 4 บิต
- **เศษส่วนฐานสอง:** `.101` = 1×2⁻¹ + 0×2⁻² + 1×2⁻³ = 0.5+0.125 = 0.625
- ตัวอย่าง: `0xB7 = 1011 0111 = 267₈ = 183₁₀`
- **รหัสอื่น:** **BCD** = เข้ารหัสทีละหลักฐานสิบเป็น 4 บิต (เช่น 45 → `0100 0101`) · **Gray code** = ต่างกันทีละ 1 บิตระหว่างค่าติดกัน · **ASCII** = 7 บิต, **Unicode/UTF-8** รองรับหลายภาษา

### 2.2 การดำเนินการทางคณิตศาสตร์ของเลขฐานสอง
- **Two's complement (จำนวนติดลบ):** กลับบิตทุกตัว (one's complement) แล้ว **+1**
- **ช่วงค่า signed n บิต:** `−2ⁿ⁻¹ ถึง 2ⁿ⁻¹−1` (8 บิต = −128..127) · **unsigned:** `0 ถึง 2ⁿ−1`
- **Overflow (signed):** เกิดเมื่อบวกเลขเครื่องหมายเดียวกันแล้วผลเปลี่ยนเครื่องหมาย
- **การลบ** = บวกกับ two's complement
- **IEEE 754 (float 32 บิต):** 1 sign + 8 exponent (bias 127) + 23 mantissa · double 64 บิต = 1+11(bias 1023)+52
- 0.1 ฐานสิบ **แทนใน binary ไม่ลงตัว** → เกิด rounding error

### 2.3 การดำเนินการระดับบิต (Bitwise)
| Op | สัญลักษณ์ | ใช้ทำ |
|--|--|--|
| AND | `&` | เคลียร์บิต / mask (x & 0 = 0) |
| OR | `\|` | เซ็ตบิต (x \| 1 = 1) |
| XOR | `^` | สลับบิต / เช็คต่าง (x^x=0, x^0=x) |
| NOT | `~` | กลับทุกบิต (~x = −x−1) |
| Shift ซ้าย | `<<` | ×2ⁿ (x<<n) |
| Shift ขวา | `>>` | ÷2ⁿ (x>>n) |
- เช็คบิตที่ i: `(x >> i) & 1` · เซ็ต: `x \| (1<<i)` · เคลียร์: `x & ~(1<<i)` · toggle: `x ^ (1<<i)`
- เลขคู่/คี่: `x & 1` (0=คู่, 1=คี่)

---

## หมวด 3 — ภาษาซี
**(15 คะแนน · ปรนัย 5 + เลือกหลายคำตอบ 1)**

### 3.1 Data type (ขนาดทั่วไปบน 64-bit)
| ชนิด | ขนาด | ช่วง |
|--|--|--|
| char | 1 B | −128..127 (หรือ 0..255 unsigned) |
| short | 2 B | −32,768..32,767 |
| int | 4 B | ±2.1×10⁹ |
| long | 8 B (Linux) | ±9.2×10¹⁸ |
| float | 4 B | ~7 หลักนัยสำคัญ |
| double | 8 B | ~15 หลัก |
| pointer | 8 B | — |
- **Integer division:** ตัดเศษ **เข้าหาศูนย์** → `−7/2 = −3`, `−7%2 = −1` (เครื่องหมายตามตัวตั้ง)
- **Integer promotion / overflow**: `char c='A'; c+1 = 66`
- **ลำดับ operator (สูง→ต่ำ):** `() [] ->` > `! ~ ++ -- (unary)` > `* / %` > `+ -` > `<< >>` > `< <=` > `== !=` > `&` > `^` > `\|` > `&&` > `\|\|` > `?:` > `=`

### 3.2 การวิเคราะห์การทำงานของฟังก์ชัน
- **Pass by value** (default — ก็อปค่า) vs **pass by reference** (ส่ง pointer แก้ค่าต้นทางได้)
- **Recursion:** ต้องมี base case · ระวัง stack overflow
- **Storage class:** `auto`, `static` (คงค่าข้ามการเรียก + scope จำกัด), `extern`, `register`
- ตัวแปร local ที่ไม่ init = **ค่าขยะ** (ไม่ใช่ 0) · global/static init = 0

### 3.3 Pointer
- `int *p = &x;` → `*p` คือค่าที่ชี้, `p` คือแอดเดรส
- **ชื่อ array = pointer ไปสมาชิกตัวแรก** → `arr[i]` ≡ `*(arr+i)`
- **Pointer arithmetic:** `p+1` เลื่อนไป `sizeof(type)` ไบต์
- **อันตราย:** dangling pointer (ใช้หลัง free), null deref, memory leak (ลืม free), out-of-bounds
- `malloc/calloc` (heap) → ต้อง `free` เอง · `sizeof(array) ≠ sizeof(pointer)`

### 3.4 printf/scanf & Format Specifier (ช่วยอ่านข้อ "ทำนายผลลัพธ์")
| Specifier | ชนิด | | Specifier | ชนิด |
|--|--|--|--|--|
| `%d` / `%i` | int | | `%x` / `%X` | hex |
| `%u` | unsigned | | `%o` | octal |
| `%f` | float/double | | `%c` | char (1 ตัว) |
| `%e` | สัญกรณ์วิทย์ | | `%s` | string |
| `%p` | pointer (address) | | `%%` | เครื่องหมาย % |
- **Escape:** `\n` ขึ้นบรรทัด · `\t` แท็บ · `\0` null · `\\` backslash · `\"` อัญประกาศ
- **ความกว้าง/ทศนิยม:** `%5d` (กว้าง 5), `%.2f` (ทศนิยม 2 ตำแหน่ง), `%-5d` (ชิดซ้าย)
- ⚠️ พิมพ์ `char` ด้วย `%d` ได้ค่า ASCII (เช่น `'A'` → 65) · `scanf("%d",&x)` ต้องมี `&`

---

## หมวด 4 — คณิตศาสตร์ประยุกต์
**(20 คะแนน · ปรนัย 10)**

### 4.1 การคำนวณผู้ใช้งานของระบบ (Concurrent Users)
- **Little's Law:** `L = λ × W` (L=จำนวนในระบบ, λ=อัตราเข้า/หน่วยเวลา, W=เวลาเฉลี่ยในระบบ)
- **Concurrent users** ≈ อัตราคำขอ (req/s) × เวลาเฉลี่ยต่อ session
- **จำนวนอินสแตนซ์** = ⌈ โหลดรวม (req/s) / ความจุต่ออินสแตนซ์ ⌉ (ปัดขึ้น)
- **Throughput** = งานสำเร็จ/เวลา · **Utilization** = λ/μ (ต้อง <1)

### 4.2 คณิตศาสตร์การเข้ารหัส (Cryptography Math)
- **Modular arithmetic:** `(a+b) mod n`, `(a×b) mod n`, `aᵇ mod n` (modular exponentiation)
- **RSA:** เลือก p,q เฉพาะ → `n = p·q` , `φ(n) = (p−1)(q−1)` → เลือก e coprime กับ φ → `d = e⁻¹ mod φ(n)`
  - เข้ารหัส: `c = mᵉ mod n` · ถอด: `m = cᵈ mod n`
- **GCD (Euclidean):** `gcd(a,b) = gcd(b, a mod b)` · **LCM** = `a·b / gcd(a,b)`
- **XOR cipher:** `c = m ⊕ key` , ถอดด้วย `m = c ⊕ key`
- **Entropy รหัสผ่าน (บิต):** `L × log₂(N)` (L=ความยาว, N=ขนาดชุดอักขระ) — เช่น 8 ตัวจาก 62 ≈ 47.6 บิต
- **Diffie-Hellman:** แลกกุญแจลับผ่านช่องเปิดได้ (พึ่ง discrete log ยาก)

### 4.3 ความน่าจะเป็นเบื้องต้น
- **Permutation (สนลำดับ):** `nPr = n! / (n−r)!`
- **Combination (ไม่สนลำดับ):** `nCr = n! / (r!·(n−r)!)`
- **กฎบวก:** `P(A∪B) = P(A)+P(B)−P(A∩B)` · **กฎคูณ (อิสระ):** `P(A∩B)=P(A)·P(B)`
- **คอมพลีเมนต์:** `P(A') = 1 − P(A)` (คิด "อย่างน้อยหนึ่ง" ผ่านตัวเติมเต็ม)
- **Bayes:** `P(A|B) = P(B|A)·P(A) / P(B)`
- **ค่าคาดหมาย:** `E[X] = Σ xᵢ·P(xᵢ)`
- **Inclusion–Exclusion:** `|A∪B| = |A|+|B|−|A∩B|`

### 4.4 ทฤษฎีการคำนวณ (Theory of Computation)
- **ลำดับ Big-O (ช้าลง →):** `O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(n³) < O(2ⁿ) < O(n!)`
- **Automata:** DFA/NFA (regular language, regex) ⊂ PDA (context-free, CFG) ⊂ Turing Machine (recursively enumerable)
- **P vs NP:** P=แก้ได้ในเวลาพหุนาม, NP=ตรวจคำตอบได้ในเวลาพหุนาม, NP-complete (เช่น SAT, TSP)
- **Halting problem:** ตัดสินไม่ได้ (undecidable)
- **Master Theorem** (สำหรับ recurrence แบ่ง-พิชิต): `T(n)=aT(n/b)+f(n)`

### 4.5 การวิเคราะห์องค์ประกอบหลัก (PCA)
- ลดมิติข้อมูล (dimensionality reduction) โดยรักษาความแปรปรวน (variance) มากสุด
- ขั้นตอน: normalize → หา **covariance matrix** → หา **eigenvalue/eigenvector** → เรียง PC ตาม eigenvalue มาก→น้อย
- **Principal Component ตัวแรก** = ทิศที่ข้อมูลกระจายมากที่สุด · PC ตั้งฉากกัน (orthogonal)

### 4.6 เมทริกซ์ · ลอการิทึม · เซต (เครื่องมือช่วยคำนวณ)
- **เมทริกซ์:** det 2×2 `[[a,b],[c,d]]` = `ad − bc` · คูณได้เมื่อ (m×n)·(n×p) = m×p · identity `I` (แนวทแยง=1)
- **กฎลอการิทึม** (ใช้กับ Big-O/entropy): `log(xy)=log x+log y` · `log(x/y)=log x−log y` · `log(xⁿ)=n·log x` · `log_b x = log x / log b` · `log₂1024 = 10`
- **การดำเนินการเซต:** `A∪B` (union), `A∩B` (intersection), `A−B` (ต่าง), `A'` (complement)
  - **De Morgan (เซต):** `(A∪B)' = A'∩B'` · `(A∩B)' = A'∪B'`
  - **Inclusion-Exclusion 3 เซต:** `|A∪B∪C| = |A|+|B|+|C| − |A∩B| − |A∩C| − |B∩C| + |A∩B∩C|`
  - จำนวนสับเซตของเซตขนาด n = `2ⁿ`

---

## หมวด 5 — ระบบเครือข่าย
**(85 คะแนน! · ปรนัย 25 + เลือกหลายคำตอบ 5 + เขียนตอบ 2) — หมวดหนักสุด เตรียมให้ดี**

### 5.1 OSI Model, TCP/IP Model & แบบจำลองชั้น (⭐ ออกบ่อย)
ท่อง OSI บน→ล่าง: *"**A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing"*

| ชั้น | ชื่อ | หน้าที่ | PDU (หน่วยข้อมูล) | Protocol | อุปกรณ์ |
|--|--|--|--|--|--|
| **7** | Application | ติดต่อผู้ใช้/แอปพลิเคชัน | Data | HTTP(S), FTP, SMTP, DNS, DHCP, SNMP, Telnet, SSH, POP3, IMAP | Gateway, Host, Firewall (L7) |
| **6** | Presentation | เข้ารหัส/ถอดรหัส, แปลงรูปแบบ, บีบอัด | Data | TLS/SSL, JPEG, PNG, ASCII, MPEG | — |
| **5** | Session | สร้าง/จัดการ/ปิด session | Data | NetBIOS, RPC, PPTP, Sockets | — |
| **4** | Transport | ส่งต้นทาง→ปลายทาง, reliability, แบ่ง segment, port | **Segment** (TCP) / **Datagram** (UDP) | TCP, UDP | Firewall (L4), Load Balancer (L4) |
| **3** | Network | หาเส้นทาง (routing), addressing ด้วย IP | **Packet** | IP, ICMP, OSPF, BGP, IPsec (ARP คาบ L2/3) | **Router**, L3 Switch |
| **2** | Data Link | สร้าง frame, MAC addressing, ตรวจ error | **Frame** | Ethernet, PPP, ARP, STP, VLAN(802.1Q) | **Switch**, Bridge, NIC |
| **1** | Physical | บิต/สัญญาณไฟฟ้า-แสง, สื่อกลาง | **Bit** | (สายทองแดง, Fiber, Wi-Fi radio, RJ45) | **Hub**, Repeater, สาย/สื่อ |

- **TCP/IP 4 ชั้น (จับคู่ OSI):** Application (L5-7) · Transport (L4) · **Internet** (L3) · **Network Access/Link** (L1-2)
- **Encapsulation (ห่อข้อมูลลงชั้นล่าง):** Data → Segment → Packet → Frame → Bits · ฝั่งรับทำ **De-encapsulation** ย้อนขึ้น
- **จำ PDU:** ชั้นสูง=Data · L4=Segment/Datagram · L3=**Packet** · L2=**Frame** · L1=**Bit**
- **Client-Server** (รวมศูนย์ที่เซิร์ฟเวอร์, ขอ-ตอบ) vs **Peer-to-Peer** (ทุกโหนดเท่าเทียม เป็นทั้ง client/server)
- **อุปกรณ์แยกตาม domain:** Hub = 1 collision + 1 broadcast domain · Switch = แยก collision domain (แต่ 1 broadcast) · Router/VLAN = แยก broadcast domain

### 5.2 Network Devices & Link
| อุปกรณ์ | Layer | หน้าที่ |
|--|--|--|
| Hub | L1 | ทวนสัญญาณ (broadcast ทุกพอร์ต, 1 collision domain) |
| Switch | L2 | ส่งต่อ frame ตาม MAC (แยก collision domain) |
| Router | L3 | ส่งต่อ packet ข้ามเครือข่ายตาม IP (แยก broadcast domain) |
| L3 Switch | L2/3 | switch ที่ route ได้ |
| Firewall | L3-7 | กรองทราฟฟิก (stateful จำ session) |
| Access Point | L2 | เชื่อม Wi-Fi เข้า LAN |
- **VLAN:** แบ่ง broadcast domain เชิงตรรกะบนสวิตช์ · ข้าม VLAN ต้องผ่าน L3 (router-on-a-stick)
- **สื่อ:** Twisted pair (Cat5e/6), Fiber (เร็ว ไกล ไม่โดนสัญญาณรบกวน — single-mode ไกลกว่า multi-mode), Coaxial
- **สายทองแดง (จำ!):**
  - **Straight-through** → เชื่อม **อุปกรณ์ต่างชนิด** (PC↔Switch, Switch↔Router)
  - **Crossover** → เชื่อม **อุปกรณ์ชนิดเดียวกัน** (PC↔PC, Switch↔Switch, PC↔Router)
  - **Rollover/Console** → ต่อพอร์ต console เพื่อตั้งค่าอุปกรณ์ · มาตรฐาน **T568A/T568B** · ปัจจุบันมี Auto-MDIX ปรับให้เอง

### 5.3 Wireless Network
- **มาตรฐาน 802.11:** a/b/g/n (Wi-Fi 4) / ac (Wi-Fi 5) / ax (Wi-Fi 6) · ย่าน 2.4 GHz (ไกล ทะลุดี ช้า) vs 5 GHz (เร็ว ใกล้)
- **Topology:** Infrastructure (ผ่าน AP), Ad-hoc, **Mesh** (แต่ละโหนดส่งต่อกันได้หลายเส้นทาง ทนทาน ขยายง่าย)
- **ความปลอดภัย:** WEP (แตกง่าย) < WPA < WPA2 (AES) < WPA3 · **SSID** = ชื่อเครือข่าย
- **CSMA/CA** (Wi-Fi หลีกเลี่ยงชนกัน) vs **CSMA/CD** (Ethernet เดิม ตรวจจับชน)

### 5.4 Public / Private IP Address
- **Private (RFC1918):** `10.0.0.0/8` · `172.16.0.0/12` (172.16–172.31) · `192.168.0.0/16`
- **พิเศษ:** Loopback `127.0.0.0/8` · APIPA/Link-local `169.254.0.0/16` · Default route `0.0.0.0` · Broadcast `255.255.255.255`
- **IP Class:** A (1–126, /8) · B (128–191, /16) · C (192–223, /24) · D (224–239 multicast) · E (240–255 ทดลอง)
- **IPv6:** 128 บิต, 8 กลุ่ม hex, ย่อศูนย์ด้วย `::` (ได้ครั้งเดียว) · loopback `::1` · link-local `fe80::/10`
  - **ชนิด IPv6:** Unicast (เจาะจง 1 โหนด) · Multicast `ff00::/8` · Anycast (โหนดใกล้สุด) · **ไม่มี broadcast** · Global unicast `2000::/3`

### 5.5 การคำนวณ & แบ่ง Subnet (⭐ ออกแน่ + เขียนตอบ)
**ขั้นตอนหา Network / Broadcast / Host range:**
1. หา **block size** ของ octet ที่ prefix ตกอยู่ = `256 − ค่า mask octet`
2. **Network address** = ปัดค่า octet ลงเป็นพหุคูณของ block size (AND กับ mask)
3. **Broadcast** = network + block − 1 (ในหลักนั้น)
4. **Host ใช้ได้** = (network+1) ถึง (broadcast−1)

> ⚠️ **จุดพลาดบ่อย:** ถ้า prefix เป็น /17–/23 (คร่อม octet ที่ 3) ต้องคิดที่ **octet ที่ 3** ไม่ใช่ octet สุดท้าย!

**ตัวอย่าง `192.168.10.130/26`:** mask .192, block=64 → 130 อยู่ในบล็อก 128–191 →
Network `192.168.10.128` · Broadcast `192.168.10.191` · Host `.129–.190`

**ตัวอย่าง `110.58.75.5/20`** (คร่อม octet 3): mask 255.255.**240**.0, block ที่ octet3 = 16 → 75 → บล็อก 64–79 →
Network `110.58.64.0` · Broadcast `110.58.79.255` · Host `110.58.64.1 – 110.58.79.254`

**FLSM (Fixed-Length):** ทุก subnet ขนาดเท่ากัน — แบ่ง /24 เป็น 4 subnet ใช้ /26 (ยืม 2 บิต, 2²=4 วง วงละ 62 host)

**⚡ Magic Number (คิดในหัวเร็ว):** magic = 256 − ค่า mask octet = block size → network address เป็นพหุคูณของ magic ที่ ≤ ค่า octet ของ IP
- เช่น /26 → mask .192 → magic 64 → ขอบเขต 0, 64, 128, 192 · IP .130 → ตกในบล็อก 128

**FLSM (Fixed-Length):** ทุก subnet ขนาดเท่ากัน — แบ่ง /24 เป็น 4 subnet ใช้ /26 (ยืม 2 บิต, 2²=4 วง วงละ 62 host)

**VLSM (Variable-Length):** subnet ขนาดต่างกันตามจำนวน host — **จัดวงใหญ่ก่อน**
- ต้องการ host N → host bits = ⌈log₂(N+2)⌉ → prefix = 32 − host bits
  - 50 host → ต้อง 6 บิต (64) → /26 · 100 host → 7 บิต (128) → /25 · 500 host → 9 บิต → /23
- **ตัวอย่าง VLSM เต็ม:** แบ่ง `192.168.1.0/24` ให้ A=100, B=50, C=25, D=2 (WAN)

| แผนก | host | prefix | ช่วง network |
|--|--|--|--|
| A (100) | ≥126 | /25 | 192.168.1.0 – .127 |
| B (50) | ≥62 | /26 | 192.168.1.128 – .191 |
| C (25) | ≥30 | /27 | 192.168.1.192 – .223 |
| D (2) | ≥2 | /30 | 192.168.1.224 – .227 |

- **Route summarization (supernet):** รวมหลาย network เป็น prefix เดียว
  - `192.168.4.0/24 – .7.0/24` (4 วงต่อเนื่อง) → `192.168.4.0/22`

### 5.6 NAT (Network Address Translation)
- แปลง **private IP → public IP** (แก้ปัญหา IPv4 หมด)
- **Static NAT** (1:1) · **Dynamic NAT** (pool) · **PAT/NAT Overload** (หลายเครื่องใช้ 1 public IP แยกด้วย port — พบบ่อยสุด)
- **SNAT** (แก้ต้นทาง, ขาออก) vs **DNAT** (แก้ปลายทาง, port forwarding เข้ามา)

### 5.7 Routing Protocol (⭐ RIP vs OSPF vs BGP)
| Protocol | ชนิด | Metric | AD | ขอบเขต | หมายเหตุ |
|--|--|--|--|--|--|
| **RIP** | Distance Vector | hop count (max **15**, 16=ไปไม่ถึง) | **120** | ภายใน (IGP) เล็ก | ง่าย แต่ช้า/สเกลไม่ดี |
| **OSPF** | Link State | **cost** = 10⁸/bandwidth | **110** | ภายใน (IGP) กลาง-ใหญ่ | open standard, เร็ว |
| **EIGRP** | Advanced DV (Cisco) | bandwidth+delay | **90** (in) /170 (ext) | ภายใน (IGP) | ของ Cisco, DUAL |
| **BGP** | Path Vector | AS-path + policy | **eBGP 20 / iBGP 200** | ระหว่าง AS (EGP) | โปรโตคอลของอินเทอร์เน็ต, TCP/179 |

**ทำงานอย่างไร:**
- **RIP** — แต่ละ router **ส่งตารางเส้นทางทั้งหมดให้เพื่อนบ้าน**ทุก 30 วิ, วัดระยะด้วยจำนวน hop, เลือกเส้นที่ hop น้อยสุด · convergence ช้า, เสี่ยง loop → กันด้วย **split horizon, poison reverse, hold-down timer** · RIPv2 รองรับ VLSM (classless)
- **OSPF** — แต่ละ router **รู้ topology ทั้งหมด** (แลก LSA + hello), คำนวณเส้นสั้นสุดด้วย **Dijkstra (SPF)**, แบ่งเป็น **area** (area 0 = backbone) · convergence เร็ว, สเกลดี · เลือกเส้นที่ **cost รวมต่ำสุด** (cost แปรผกผันกับ bandwidth)
- **BGP** — ใช้**ระหว่าง Autonomous System** (เชื่อมอินเทอร์เน็ต), ตัดสินด้วย **AS-path** ที่สั้นสุด + นโยบาย (attribute) · เชื่อถือได้ผ่าน TCP/179, สเกลใหญ่มากแต่ convergence ช้า

**Administrative Distance (AD) — "ความน่าเชื่อถือ, ยิ่งน้อยยิ่งได้สิทธิ์ก่อน":**

| แหล่งเส้นทาง | AD | | แหล่งเส้นทาง | AD |
|--|--|--|--|--|
| Connected (ต่อตรง) | **0** | | OSPF | 110 |
| Static | **1** | | IS-IS | 115 |
| eBGP | 20 | | RIP | 120 |
| EIGRP (internal) | 90 | | EIGRP (external) | 170 |
| | | | iBGP | 200 · Unknown 255 |

- **ลำดับการเลือกเส้นทางของ router:** ① **Longest Prefix Match** (prefix ยาวสุดชนะก่อนเสมอ) → ② ถ้า prefix เท่ากันเลือก **AD ต่ำสุด** → ③ ถ้าโปรโตคอลเดียวกันเลือก **metric ต่ำสุด**
- 🔑 เช่น เส้นทางเดียวกันมาจาก OSPF (AD 110) และ RIP (AD 120) → router เชื่อ **OSPF** · Static (1) ชนะทั้งคู่
- **Static** (ตั้งมือ) vs **Dynamic** (โปรโตคอลเรียนรู้เอง) · **Default gateway/route** = `0.0.0.0/0` (ใช้เมื่อไม่ตรงเส้นอื่น)
- **IGP** (ภายใน AS: RIP/OSPF/EIGRP) vs **EGP** (ระหว่าง AS: BGP)

### 5.8 Application Layer Protocol & พอร์ต
| Port | Protocol | | Port | Protocol |
|--|--|--|--|--|
| 20/21 | FTP | | 143 | IMAP |
| 22 | SSH/SFTP | | 161/162 | SNMP |
| 23 | Telnet | | 389 | LDAP |
| 25 | SMTP | | 443 | **HTTPS** |
| 53 | **DNS** | | 587 | SMTP (submission) |
| 67/68 | DHCP | | 993 | IMAPS |
| 69 | TFTP | | 3306 | MySQL |
| 80 | **HTTP** | | 3389 | RDP |
| 110 | POP3 | | 5432 | PostgreSQL |
| 123 | NTP | | 8080 | HTTP-alt |
- **DNS record:** A (→IPv4), AAAA (→IPv6), CNAME (alias), MX (mail), NS, PTR (reverse), TXT, SOA · DNS ใช้ **UDP/53** (query สั้น), TCP/53 (zone transfer)
- **DHCP DORA:** Discover → Offer → Request → Acknowledge
- **TCP vs UDP:** TCP = เชื่อถือได้, มี handshake, จัดลำดับ, flow/congestion control (HTTP, SSH, FTP) · UDP = เร็ว ไม่รับประกัน (DNS, VoIP, streaming, DHCP)
- **TCP 3-way handshake:** SYN → SYN-ACK → ACK · ปิด 4-way (FIN/ACK)
- **TCP flags:** **SYN** (เริ่มเชื่อมต่อ) · **ACK** (ยืนยัน) · **FIN** (ขอปิด) · **RST** (รีเซ็ต/ปฏิเสธ) · **PSH** (ส่งทันที) · **URG** (ด่วน)
- **TCP header (ฟิลด์สำคัญ):** Source/Dest Port, Sequence #, Acknowledgment #, Flags, Window size (flow control), Checksum · **UDP header** เล็กกว่า (มีแค่ port, length, checksum — ไม่มี seq/ack)
- **ICMP types (วินิจฉัยเครือข่าย):** Echo Request(8)/Reply(0) = **ping** · Destination Unreachable(3) · Time Exceeded(11) = **traceroute/TTL หมด** · Redirect(5)

### 5.9 HTTP Method & Status Code
**Methods:**
| Method | ใช้ | Safe | Idempotent |
|--|--|--|--|
| GET | อ่าน | ✓ | ✓ |
| POST | สร้าง (ไม่ idempotent) | ✗ | ✗ |
| PUT | แทนที่ทั้งชิ้น | ✗ | ✓ |
| PATCH | แก้บางส่วน | ✗ | ✗ |
| DELETE | ลบ | ✗ | ✓ |
| HEAD | เหมือน GET ไม่เอา body | ✓ | ✓ |

**Status Code (จำกลุ่มร้อย + ตัวเด่น):**
- **1xx Informational:** 100 Continue · 101 Switching Protocols
- **2xx Success:** **200 OK** · 201 Created · 202 Accepted · 204 No Content · 206 Partial Content (range/สตรีม)
- **3xx Redirect:** 301 Moved Permanently (ถาวร) · 302 Found (ชั่วคราว) · **304 Not Modified** (ใช้ cache) · 307/308 Temporary/Permanent Redirect (คงเมธอด)
- **4xx Client Error (ผิดฝั่งผู้ขอ):** **400** Bad Request · **401** Unauthorized (ยังไม่ยืนยันตัวตน) · **403** Forbidden (ยืนยันแล้วแต่ไม่มีสิทธิ) · **404** Not Found · 405 Method Not Allowed · 408 Request Timeout · 409 Conflict · 410 Gone · 413 Payload Too Large · **429** Too Many Requests (rate limit)
- **5xx Server Error (ผิดฝั่งเซิร์ฟเวอร์):** **500** Internal Server Error · 501 Not Implemented · **502** Bad Gateway · **503** Service Unavailable (โหลดเกิน/ปิดปรับปรุง) · **504** Gateway Timeout
- 🔑 จำแยก **401 (ไม่รู้ว่าเป็นใคร)** vs **403 (รู้แล้วแต่ห้าม)** · **502 (gateway ได้คำตอบเสีย)** vs **504 (gateway รอ timeout)**

### 5.10 Network Performance
- **Bandwidth** = ความจุสูงสุด (bps) · **Throughput** = อัตราจริง · **Latency** = ดีเลย์ · **Jitter** = ความแปรปรวนดีเลย์
- **เวลาส่งไฟล์** = ขนาด(bit) / bandwidth(bps) — ระวังหน่วย! `1 Byte = 8 bit`, `1 MB = 8 Mb`
  - เช่น 100 MB ผ่าน 50 Mbps = 100×8/50 = **16 วินาที**
- **Bandwidth-Delay Product (BDP)** = bandwidth × RTT (ปริมาณข้อมูลที่กำลังเดินทาง)
- **RTT** = round-trip time · **Goodput** = throughput ที่มีประโยชน์จริง (หัก overhead/retransmit)

### 5.11 Network Lab & คำสั่ง Cisco (Switch / Router / VLAN / ACL)

**โหมด Cisco IOS (ลำดับเข้าโหมด):**
```
Switch> enable                  ! user EXEC → privileged EXEC
Switch# configure terminal      ! เข้าโหมด global config
Switch(config)# ...             ! config ทั้งเครื่อง
Switch(config-if)# ...          ! config ราย interface
Switch(config-vlan)# ...        ! config ราย VLAN
```
- `exit` ถอยหนึ่งโหมด · `end` / `Ctrl+Z` กลับ privileged · `do <cmd>` รันคำสั่ง EXEC ในโหมด config
- **บันทึกค่า:** `copy running-config startup-config` (หรือ `write memory` / `wr`)

**คำสั่ง show ที่ใช้ตรวจ (verify):**
| คำสั่ง | ดูอะไร |
|--|--|
| `show running-config` | ค่าคอนฟิกปัจจุบัน |
| `show ip interface brief` | สรุป IP/สถานะทุกพอร์ต (up/down) |
| `show vlan brief` | VLAN และพอร์ตที่สังกัด |
| `show interfaces trunk` | พอร์ต trunk + VLAN ที่ผ่าน |
| `show mac address-table` | ตาราง MAC ที่สวิตช์เรียนรู้ |
| `show ip route` | ตาราง routing (C=connected, S=static, O=OSPF) |
| `show access-lists` | ACL ที่ตั้งไว้ |

**VLAN (แบ่ง broadcast domain เชิงตรรกะ):**
```
Switch(config)# vlan 10
Switch(config-vlan)# name SALES
Switch(config)# interface fa0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10      ! ใส่พอร์ตเข้า VLAN 10
```
- **Trunk** (ส่งหลาย VLAN ข้ามสวิตช์ ใช้แท็ก **802.1Q**):
```
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20
Switch(config-if)# switchport trunk native vlan 99  ! VLAN ที่ไม่ติดแท็ก
```
- **Inter-VLAN routing:** ใช้ **Router-on-a-stick** (แบ่ง subinterface + `encapsulation dot1Q <id>`) หรือ **SVI** บน L3 switch (`interface vlan 10` + ตั้ง IP)

**Router — ตั้ง IP interface & เส้นทาง:**
```
Router(config)# interface g0/0
Router(config-if)# ip address 192.168.1.1 255.255.255.0
Router(config-if)# no shutdown                    ! เปิดพอร์ต (default ปิด)
Router(config)# ip route 10.0.0.0 255.0.0.0 192.168.1.2   ! static route
Router(config)# ip route 0.0.0.0 0.0.0.0 192.168.1.2      ! default route
```

**ACL (Access Control List) — กรองทราฟฟิก:**
- **Standard (1–99):** กรองตาม **source IP** เท่านั้น → วางใกล้ **ปลายทาง**
- **Extended (100–199):** กรองตาม source+dest IP, protocol, port → วางใกล้ **ต้นทาง**
- ใช้ **wildcard mask** (กลับด้าน subnet mask: `0.0.0.255` = ทั้ง /24)
```
! Standard: ห้าม 192.168.1.0/24, อนุญาตที่เหลือ
Router(config)# access-list 10 deny 192.168.1.0 0.0.0.255
Router(config)# access-list 10 permit any
Router(config)# interface g0/1
Router(config-if)# ip access-group 10 out

! Extended: ห้าม host หนึ่งเข้าเว็บ (HTTP/80) ของเซิร์ฟเวอร์
Router(config)# access-list 100 deny tcp host 192.168.1.5 host 10.0.0.8 eq 80
Router(config)# access-list 100 permit ip any any
Router(config-if)# ip access-group 100 in
```
- ⚠️ ท้าย ACL มี **implicit deny any** เสมอ (ต้องมี `permit` ปิดท้ายไม่งั้นบล็อกหมด) · อ่านกฎ **บนลงล่าง เจอ match แรกหยุด**

**อื่น ๆ ที่ควรรู้:**
- **Port Security:** `switchport port-security` จำกัด MAC ต่อพอร์ต (กัน rogue device)
- **STP (Spanning Tree, 802.1D):** กัน loop ใน L2 (block พอร์ตซ้ำซ้อน)
- **EtherChannel:** รวมหลายลิงก์เป็นลิงก์ตรรกะเดียว (เพิ่ม bandwidth + redundancy)
- **DHCP บน router:** `ip dhcp pool <name>` → `network`, `default-router`, `dns-server`
- **Password:** `enable secret <pw>` (เข้ารหัส), `line vty 0 4` + `login`/`transport input ssh` (รีโมต SSH)

### 5.12 มาตรฐาน IEEE 802 ที่เกี่ยวกับเครือข่าย (จำกลุ่มหลัก)
| มาตรฐาน | เรื่อง | รายละเอียด |
|--|--|--|
| **802.1** | Bridging/Architecture | **802.1Q** = VLAN tagging (trunk) · **802.1D** = STP (กัน loop) · **802.1w** = RSTP (เร็วขึ้น) · **802.1X** = port-based authentication (NAC) |
| **802.2** | LLC | Logical Link Control (ชั้นย่อยบนของ Data Link) |
| **802.3** | **Ethernet (มีสาย)** | 802.3u = Fast Ethernet 100 Mbps · 802.3ab = Gigabit (copper) · 802.3ae = 10 GbE · **802.3af/at = PoE / PoE+** (จ่ายไฟผ่านสาย LAN) |
| **802.5** | Token Ring | (เก่า/เลิกใช้แล้ว) |
| **802.11** | **Wi-Fi (ไร้สาย)** | b/g (2.4G) · a (5G) · n=Wi-Fi 4 · ac=Wi-Fi 5 · ax=Wi-Fi 6 · **802.11i** = WPA2 security |
| **802.15** | WPAN (ระยะสั้น) | **802.15.1 = Bluetooth** · **802.15.4 = Zigbee** |
| **802.16** | WiMAX | บรอดแบนด์ไร้สายระยะไกล |

- 🔑 จำแกน: **802.3 = สาย (Ethernet)** · **802.11 = ไร้สาย (Wi-Fi)** · **802.1Q = VLAN** · **802.1X = auth** · **802.15.1 = Bluetooth**

---

## หมวด 6 — Cloud Computing
**(70 คะแนน · ปรนัย 25 + เลือกหลายคำตอบ 2 + เขียนตอบ 2)**

### โมเดลบริการ (จำให้แม่น!)
| โมเดล | ผู้ให้บริการดูแล | ลูกค้าดูแล | ตัวอย่าง |
|--|--|--|--|
| **On-premise** | — | ทุกอย่าง | server ในองค์กร |
| **IaaS** | ฮาร์ดแวร์+virtualization | OS ขึ้นไป | EC2, Azure VM, Compute Engine |
| **PaaS** | ถึง runtime/OS | โค้ด+ข้อมูล | App Engine, Heroku, Azure App Service |
| **FaaS/Serverless** | ทุกอย่างยกเว้นโค้ด | ฟังก์ชัน | Lambda, Cloud Functions |
| **SaaS** | ทุกอย่าง | แค่ใช้งาน | Gmail, Office 365, Salesforce |
> เปรียบพิซซ่า: On-prem=ทำเอง, IaaS=ซื้อวัตถุดิบ, PaaS=สั่ง delivery, SaaS=ไปกินร้าน

- **Shared Responsibility:** IaaS → ลูกค้าแพตช์ OS เอง · ผู้ให้บริการดูแลถึง hypervisor/ฮาร์ดแวร์
- **Deployment:** Public / Private / Hybrid / Multi-cloud
- **5 คุณลักษณะ NIST:** on-demand self-service, broad network access, resource pooling, rapid elasticity, measured service

### 6.1 Virtualization
- **Hypervisor Type 1** (bare-metal, รันบนฮาร์ดแวร์ตรง เช่น ESXi, Hyper-V, KVM) vs **Type 2** (รันบน OS เช่น VirtualBox, VMware Workstation)
- **VM** (มี guest OS เต็ม, หนัก, isolation สูง) vs **Container** (แชร์ kernel, เบา, บูตเร็ว)

### 6.2 Load Balancing
- **Algorithm:** Round Robin, Weighted RR, **Least Connections**, IP Hash, Least Response Time
- **L4 LB** (ตาม IP/port) vs **L7 LB** (ตาม HTTP content/path)
- **Health check** ตัดเครื่องที่ล่มออก · คู่กับ **Auto-scaling**
- **Sticky session** (session affinity) ผูก client กับเครื่องเดิม

### 6.3 บริการ Public Cloud (GCP / Azure / AWS)
| หมวด | AWS | Azure | GCP |
|--|--|--|--|
| VM (compute) | EC2 | Virtual Machines | Compute Engine |
| Serverless | Lambda | Functions | Cloud Functions |
| Container orch. | EKS | AKS | GKE |
| Object storage | **S3** | Blob Storage | Cloud Storage |
| Block storage | EBS | Managed Disks | Persistent Disk |
| Relational DB | RDS | Azure SQL | Cloud SQL |
| NoSQL | DynamoDB | Cosmos DB | Firestore/Bigtable |
| Data warehouse | Redshift | Synapse | BigQuery |
| Network | VPC | VNet | VPC |
| Load Balancer | ELB/ALB | Load Balancer | Cloud LB |
| DNS | Route 53 | Azure DNS | Cloud DNS |
| CDN | CloudFront | Front Door/CDN | Cloud CDN |
| IAM | IAM | Entra ID (Azure AD) | Cloud IAM |
| IaC (native) | CloudFormation | ARM/Bicep | Deployment Manager |
| Message queue | SQS | Service Bus | Pub/Sub |
| Monitoring | CloudWatch | Monitor | Cloud Monitoring |

- **Storage class:** object (S3, เก็บ blob/สื่อ เข้าผ่าน HTTP) vs block (ดิสก์ VM) vs file (NFS/SMB)

### 6.4 การดูแลระบบ Linux (คำสั่งที่ต้องรู้)
| กลุ่ม | คำสั่ง |
|--|--|
| ไฟล์ | `ls, cd, pwd, cp, mv, rm, mkdir, find, cat, less, head, tail` |
| สิทธิ | `chmod` (rwx: r=4 w=2 x=1 → 755=rwxr-xr-x), `chown`, `sudo` |
| กระบวนการ | `ps, top, htop, kill, systemctl, jobs, &, nohup` |
| เครือข่าย | `ping, ip a, ifconfig, netstat, ss, curl, wget, ssh, scp, dig, nslookup, traceroute` |
| ดิสก์ | `df -h, du, mount, lsblk` |
| ข้อความ | `grep, sed, awk, wc, sort, uniq, `\|` (pipe), `>` `>>` (redirect)` |
| แพ็กเกจ | `apt/yum/dnf install`, `dpkg/rpm` |
- **chmod เลข:** owner-group-other แต่ละหลัก = r(4)+w(2)+x(1) · `chmod 644` = rw-r--r--
- Path: `/etc` (config), `/var/log` (logs), `/home`, `/root`, `/proc` · `~` = home, `.` = ปัจจุบัน

### 6.5 Container
- **Docker:** image (template อ่านอย่างเดียว) → container (instance ที่รัน) · Dockerfile → build → run
- คำสั่ง: `docker build/run/ps/images/exec/pull/push` · **Registry:** Docker Hub, ECR
- **Kubernetes (K8s):** orchestration — **Pod** (หน่วยเล็กสุด, 1+ container), Node, Deployment (จัดการ replica), Service (เข้าถึง), ReplicaSet, Namespace, Ingress
- ข้อดี container: portable, consistent ข้าม env, เบา, สเกลเร็ว

### 6.6 Infrastructure as Code (IaC)
- นิยาม infra ด้วยไฟล์โค้ด → ทำซ้ำได้ (reproducible), version control, ลด config drift
- **Terraform** (multi-cloud, declarative, HCL) · **Ansible** (config mgmt, agentless, YAML) · **CloudFormation** (AWS) · **ARM/Bicep** (Azure) · **Pulumi**
- **Declarative** (บอกผลลัพธ์ที่ต้องการ) vs **Imperative** (บอกขั้นตอน)
- **Idempotent:** รันซ้ำได้ผลเหมือนเดิม

### 6.7 System Design บน Cloud & ความพร้อมใช้งาน
- **SLA Availability → Downtime** (จำตารางนี้!):

| Availability | Downtime/ปี | Downtime/เดือน |
|--|--|--|
| 99% ("two nines") | 3.65 วัน | 7.2 ชม. |
| 99.9% ("three nines") | 8.76 ชม. | 43.2 นาที |
| 99.99% ("four nines") | 52.6 นาที | 4.32 นาที |
| 99.999% ("five nines") | 5.26 นาที | 26 วินาที |

- **สูตร:** `Downtime = (1 − A) × ช่วงเวลา` (ปี = 525,600 นาที, เดือน 30 วัน = 43,200 นาที)
- **Availability รวม** — อนุกรม (พึ่งกัน): `A₁ × A₂` (ต่ำลง) · ขนาน (สำรอง): `1 − (1−A₁)(1−A₂)` (สูงขึ้น)
- **Availability = MTBF / (MTBF + MTTR)** · MTBF=เวลาเฉลี่ยระหว่างเสีย, MTTR=เวลาเฉลี่ยซ่อม
- **RPO** (ข้อมูลที่ยอมเสีย, ย้อนหลังแค่ไหน) vs **RTO** (เวลาที่ยอมให้ล่ม)
- **CAP Theorem:** เมื่อเกิด **P**artition ต้องเลือก **C**onsistency หรือ **A**vailability
- **Scaling:** Horizontal/scale-out (เพิ่มเครื่อง) vs Vertical/scale-up (เพิ่มสเปก) · Elasticity=ปรับอัตโนมัติตามโหลด
- **Region** (พื้นที่ภูมิศาสตร์) > **Availability Zone** (data center แยกไฟ/เน็ต) · กระจายหลาย AZ = fault tolerance
- **Blue-Green deploy** (สลับ 2 env, rollback เร็ว) · **Canary** (ปล่อยทีละส่วน) · **Rolling update**
- **CDN** แคชใกล้ผู้ใช้ ลด latency · **Caching** (Redis/Memcached) · **Message queue** (async, decouple)
- **Microservices** (แยกบริการเล็ก ๆ) vs **Monolith** · **Stateless** สเกลง่ายกว่า **stateful**

---

## หมวด 7 — เทคโนโลยีทั่วไป
**(50 คะแนน · ปรนัย 20 + เลือกหลายคำตอบ 1 + เขียนตอบ 1) — บูรณาการหลายด้าน**

- **Version control (Git):** commit, branch, merge, pull request, `git clone/add/commit/push/pull/merge` · distributed VCS
- **CI/CD:** Continuous Integration (รวมโค้ด+ทดสอบอัตโนมัติ), Continuous Delivery/Deployment (ปล่อยอัตโนมัติ) · เครื่องมือ: Jenkins, GitLab CI, GitHub Actions
- **Testing:** Unit (ส่วนย่อย) < Integration (หลายส่วนทำงานร่วม) < E2E (ทั้งระบบ) · TDD
- **Database:** SQL/RDBMS (schema ตายตัว, ACID, join) vs NoSQL (ยืดหยุ่น, scale-out: document/key-value/column/graph)
  - **ACID:** Atomicity, Consistency, Isolation, Durability · **Normalization** ลดความซ้ำซ้อน (1NF/2NF/3NF)
  - **Index** เร่ง query (แลกกับพื้นที่+เขียนช้าลง)
- **AI/ML:** Supervised (มี label) vs Unsupervised (clustering, ไม่มี label) vs Reinforcement · overfitting/underfitting · neural network, LLM
- **Web:** HTTP/HTTPS (HTTPS = HTTP over TLS), REST API (stateless, ใช้ HTTP verb ตรงความหมาย), JSON, WebSocket, GraphQL
- **Security เพิ่มเติม:** TLS/SSL, digital certificate (CA รับรอง), symmetric vs asymmetric, PKI, firewall stateful vs stateless
- **Big Data:** MapReduce (Map แตกงาน → Reduce รวมผล), Hadoop, Spark · Data Lake (ดิบ, schema-on-read) vs Data Warehouse (จัดโครงสร้าง, schema-on-write)
- **Emerging:** Edge computing (ประมวลผลใกล้ผู้ใช้ ลด latency), IoT, Blockchain (distributed ledger, immutable), Quantum, 5G
- **Compression:** Lossless (ZIP, PNG — คืนครบ) vs Lossy (JPEG, MP3 — เสียบางส่วน)
- **Reliability:** PUE (data center, ยิ่งใกล้ 1 ยิ่งดี), Green computing

---

## หมวด 8 — เชาว์ & ตรรกะ
**(35 คะแนน · ปรนัย 15 + เลือกหลายคำตอบ 1)**

### 8.1 อนุกรมตัวเลข (หากฎ)
- **เลขคณิต:** ผลต่างคงที่ (+d) · **เรขาคณิต:** อัตราส่วนคงที่ (×r)
- **ผลต่างชั้นสอง:** ผลต่างเพิ่มขึ้นเรื่อย ๆ (มัก n²) เช่น 2,5,10,17,26 (n²+1)
- **Fibonacci:** พจน์ = ผลรวมสองพจน์ก่อน (1,1,2,3,5,8,13)
- **กำลัง:** n² (1,4,9,16,25) · n³ (1,8,27,64) · แฟกทอเรียล (1,2,6,24,120)
- **Recurrence:** aₙ = k·aₙ₋₁ ± c (เช่น ×2+1: 3,7,15,31) · **จำนวนเฉพาะ:** 2,3,5,7,11,13
- **สลับ/แทรก:** สลับ 2 กฎ เช่น +3,+2,+3,+2 หรือแทรกสองอนุกรม

### 8.2 ตรรกศาสตร์เชิงประพจน์ (Propositional Logic) ⭐

**ตารางค่าความจริง (Truth Table) — จำให้แม่น:**
| p | q | ¬p | p∧q (และ) | p∨q (หรือ) | p→q (ถ้า…แล้ว) | p↔q (ก็ต่อเมื่อ) | p⊕q (XOR) |
|--|--|--|--|--|--|--|--|
| T | T | F | **T** | T | **T** | **T** | F |
| T | F | F | F | T | **F** ⚠️ | F | T |
| F | T | T | F | T | **T** | F | T |
| F | F | T | F | **F** | **T** | **T** | F |

- 🔑 **`p→q` เป็นเท็จกรณีเดียว:** p จริง แต่ q เท็จ (T→F=F) · ถ้า p เท็จ → เป็นจริงเสมอ (vacuously true)
- **`p∧q`** จริงเมื่อ **ทั้งคู่จริง** · **`p∨q`** เท็จเมื่อ **ทั้งคู่เท็จ** · **`p↔q`** จริงเมื่อ **ค่าเหมือนกัน** · **XOR** จริงเมื่อ **ต่างกัน**
- ตัวอย่าง `¬p → q`: ถ้า p เท็จ (¬p จริง) ประโยคเป็นจริงก็ต่อเมื่อ q จริง

**รูปแปลงของประพจน์เงื่อนไข (p→q):**
| ชื่อ | รูป | สมมูลกับ p→q? |
|--|--|--|
| Converse (บทกลับ) | q → p | ❌ ไม่สมมูล |
| Inverse (นิเสธ) | ¬p → ¬q | ❌ ไม่สมมูล |
| **Contrapositive** | ¬q → ¬p | ✅ **สมมูล** |
- `p → q ≡ ¬p ∨ q` (แปลง implication เป็น or)

**กฎสมมูลตรรกศาสตร์ (Logical Equivalences):**
- **De Morgan:** `¬(p∧q) ≡ ¬p∨¬q` · `¬(p∨q) ≡ ¬p∧¬q`
- **Double negation:** `¬(¬p) ≡ p` · **Idempotent:** `p∧p ≡ p`, `p∨p ≡ p`
- **Commutative / Associative / Distributive:** `p∧(q∨r) ≡ (p∧q)∨(p∧r)`
- **Absorption:** `p∨(p∧q) ≡ p` · **Identity:** `p∧T ≡ p`, `p∨F ≡ p`
- **Negation:** `p∨¬p ≡ T` (tautology), `p∧¬p ≡ F` (contradiction)

**กฎการอนุมาน (Rules of Inference) — ใช้สรุปโจทย์:**
| กฎ | เงื่อนไข (Premises) | สรุป |
|--|--|--|
| **Modus Ponens** | p→q , p | ∴ q |
| **Modus Tollens** | p→q , ¬q | ∴ ¬p |
| **Hypothetical Syllogism** | p→q , q→r | ∴ p→r |
| **Disjunctive Syllogism** | p∨q , ¬p | ∴ q |
| Addition | p | ∴ p∨q |
| Simplification | p∧q | ∴ p |

- **นิเสธตัวบ่งปริมาณ:** `¬(∀x P(x)) ≡ ∃x ¬P(x)` ("ไม่ใช่ทุกตัว" = "มีบางตัวที่ไม่") · `¬(∃x P) ≡ ∀x ¬P`
- **Syllogism (คำ):** "ทุก A เป็น B" + "ทุก B เป็น C" → "ทุก A เป็น C" · ⚠️ ระวังคำว่า **"บาง"** (some) สรุปเกินไม่ได้
- **ตัวอย่างการใช้:** "ถ้าฝนตกแล้วถนนเปียก" + "ถนนไม่เปียก" → (Modus Tollens) **ฝนไม่ตก**

### 8.3 โจทย์คำนวณเร็ว
- **อัตราการทำงานร่วม:** A เสร็จใน a, B ใน b → รวม `1/(1/a + 1/b) = ab/(a+b)` ชม.
- **ความเร็วเฉลี่ย** (ไป-กลับ ระยะเท่ากัน) = `2·v₁·v₂/(v₁+v₂)` (harmonic mean) — **ไม่ใช่** ค่าเฉลี่ยเลขคณิต!
- **%:** เพิ่ม 10% แล้วลด 10% = ×1.1×0.9 = 0.99 (ลดสุทธิ 1%)
- **สามเหลี่ยมมุมฉาก 3-4-5, 5-12-13** (Pythagorean)
- **ปัญหากับดัก:** "แซงที่ 2 = ได้ที่ 2" · "ตี n ครั้ง มี n−1 ช่วง"

### 8.4 ประเภทโจทย์เชาว์ที่พบบ่อย (จำวิธี)
- **มุมเข็มนาฬิกา:** `|30·H − 5.5·M|` องศา (ถ้า >180 ใช้ 360 − ค่านั้น) · เช่น 3:00 = 90°
- **Coding-Decoding:** แทนตัวอักษรด้วยเลข (A=1…Z=26) หรือเลื่อนตำแหน่ง เช่น +1: CAT→DBU
- **Direction Sense (ทิศทาง):** วาดเส้นทาง แล้วใช้พีทาโกรัสหาระยะตรงจากจุดเริ่ม
- **Blood Relations (เครือญาติ):** วาดผังครอบครัว · "ลูกชายของพ่อฉัน" = พี่/น้องชาย
- **Calendar (ปฏิทิน):** 1 ปีปกติ = 52 สัปดาห์ + 1 วัน (odd day) · ปีอธิกสุรทิน +2 วัน
- **Venn Diagram:** ใช้ inclusion-exclusion นับจำนวนแต่ละส่วน (เรียนกี่วิชา/ชอบกี่อย่าง)
- **Analogy (อุปมา):** หาความสัมพันธ์ A:B แล้วเทียบ C:? · **Odd one out:** หาตัวที่ต่างกลุ่ม

---

## อภิธานศัพท์ (Glossary)
> รูปแบบ: **ศัพท์** — ย่อมาจากอะไร — *ความหมาย & ใช้ทำอะไร*

### Identity & Security (ตัวตน & ความปลอดภัย)
| ศัพท์ | ย่อจาก | ความหมาย & ใช้ทำอะไร |
|--|--|--|
| **SSO** | Single Sign-On | ล็อกอินครั้งเดียว เข้าใช้ได้หลายระบบ/แอปโดยไม่ต้องกรอกรหัสซ้ำ — ลดภาระผู้ใช้และรวมศูนย์การจัดการ |
| **IAM** | Identity & Access Management | ระบบจัดการ "ใครเป็นใคร มีสิทธิทำอะไร" — สร้าง user/role/policy กำหนดสิทธิเข้าถึงทรัพยากร |
| **MFA / 2FA** | Multi-/Two-Factor Auth | ยืนยันตัวตนมากกว่า 1 ปัจจัย (รู้=รหัส + มี=OTP/มือถือ + เป็น=biometric) — กันบัญชีถูกขโมยแม้รหัสหลุด |
| **RBAC** | Role-Based Access Control | ให้สิทธิตาม "บทบาท" (เช่น admin/user) แทนการตั้งรายคน — จัดการง่าย ขยายได้ |
| **ACL** | Access Control List | รายการกฎอนุญาต/ปฏิเสธการเข้าถึง (ใช้ทั้งไฟล์และ network filtering) |
| **OAuth 2.0** | Open Authorization | มาตรฐานให้สิทธิแอปเข้าถึงข้อมูลแทนผู้ใช้ โดยไม่เปิดเผยรหัสผ่าน (เช่น "Login with Google") |
| **OIDC** | OpenID Connect | ชั้น authentication บน OAuth2 — ใช้ยืนยัน "ตัวตน" ผู้ใช้ |
| **SAML** | Security Assertion Markup Language | มาตรฐาน XML ทำ SSO ระดับองค์กร (federation ระหว่างองค์กร) |
| **JWT** | JSON Web Token | โทเคนรูป JSON เซ็นชื่อได้ ใช้ส่งข้อมูลตัวตน/สิทธิแบบ stateless ระหว่าง client-server |
| **PKI** | Public Key Infrastructure | โครงสร้างจัดการคู่กุญแจ+ใบรับรอง (CA) — รากฐานของ TLS/ลายเซ็นดิจิทัล |
| **CA** | Certificate Authority | องค์กรออก/รับรองใบรับรองดิจิทัล ผูกกุญแจสาธารณะกับตัวตน — กัน MITM |
| **Least Privilege** | — | หลักให้สิทธิ "เท่าที่จำเป็น" เท่านั้น — ลดความเสียหายเมื่อถูกเจาะ |
| **Zero Trust** | — | "ไม่เชื่อถือโดยปริยาย ตรวจสอบทุกครั้ง" แม้อยู่ในเครือข่ายภายใน |
| **CIA Triad** | Confidentiality/Integrity/Availability | 3 เสาหลักความปลอดภัย: ความลับ / ความถูกต้อง / พร้อมใช้งาน |
| **IDS / IPS** | Intrusion Detection/Prevention System | ตรวจจับ (IDS) / ตรวจจับ+บล็อก (IPS) การบุกรุกในเครือข่าย |
| **DMZ** | Demilitarized Zone | เขตกันชนระหว่างเน็ตภายในกับอินเทอร์เน็ต วางเซิร์ฟเวอร์สาธารณะ (web/mail) |

### Cloud & Infra (คลาวด์ & โครงสร้างพื้นฐาน)
| ศัพท์ | ย่อจาก | ความหมาย & ใช้ทำอะไร |
|--|--|--|
| **IaaS** | Infrastructure as a Service | เช่าโครงสร้างพื้นฐาน (VM/เครือข่าย/สตอเรจ) ลูกค้าดูแล OS เอง (เช่น EC2) |
| **PaaS** | Platform as a Service | เช่าแพลตฟอร์มพร้อมรัน ผู้ให้บริการดูแล OS/runtime ลูกค้าดูแลแค่โค้ด (เช่น App Engine) |
| **SaaS** | Software as a Service | ใช้ซอฟต์แวร์สำเร็จผ่านเว็บ ไม่ต้องติดตั้ง (เช่น Gmail, Office 365) |
| **FaaS** | Function as a Service | รันโค้ดเป็นฟังก์ชันตามเหตุการณ์ จ่ายตามการเรียก scale-to-zero (Serverless เช่น Lambda) |
| **VPC** | Virtual Private Cloud | เครือข่ายส่วนตัวเสมือนในคลาวด์ — กำหนด subnet/route/firewall เอง |
| **VPN** | Virtual Private Network | อุโมงค์เข้ารหัสเชื่อมเครือข่าย/ผู้ใช้ผ่านอินเทอร์เน็ตอย่างปลอดภัย |
| **CDN** | Content Delivery Network | เครือข่ายแคชเนื้อหาไว้ใกล้ผู้ใช้ทั่วโลก — ลด latency ลดภาระ origin |
| **VM** | Virtual Machine | เครื่องเสมือนมี guest OS เต็ม รันบน hypervisor |
| **Hypervisor** | — | ซอฟต์แวร์สร้าง/จัดการ VM (Type 1 bare-metal / Type 2 บน OS) |
| **Container** | — | แพ็กแอป+dependency แชร์ kernel โฮสต์ เบา บูตเร็ว พกพาได้ (Docker) |
| **Pod** | — | หน่วยเล็กสุดใน Kubernetes (มี 1+ container ที่แชร์เครือข่าย/สตอเรจ) |
| **K8s** | Kubernetes | ระบบ orchestrate container — deploy/scale/self-heal อัตโนมัติ |
| **IaC** | Infrastructure as Code | นิยาม infra ด้วยไฟล์โค้ด ทำซ้ำได้ version control ได้ (Terraform/Ansible) |
| **SLA** | Service Level Agreement | สัญญาระดับบริการ (เช่นรับประกัน uptime 99.9%) มีบทลงโทษถ้าไม่ถึง |
| **SLO / SLI** | Objective / Indicator | เป้าหมาย (SLO) และค่าที่วัดจริง (SLI) ของระดับบริการ |
| **RTO / RPO** | Recovery Time/Point Objective | เวลาสูงสุดที่ยอมให้ล่ม (RTO) / ข้อมูลย้อนหลังที่ยอมเสีย (RPO) |
| **MTBF / MTTR** | Mean Time Between Failures / To Repair | เวลาเฉลี่ยระหว่างเสีย / เวลาเฉลี่ยซ่อม — ใช้คำนวณ availability |
| **HA** | High Availability | ออกแบบให้ระบบพร้อมใช้งานสูง (redundant, หลาย AZ, ไม่มี single point of failure) |
| **Auto-scaling** | — | เพิ่ม/ลดจำนวนอินสแตนซ์อัตโนมัติตามโหลด |
| **CAP** | Consistency-Availability-Partition | ทฤษฎี: เมื่อเกิด network partition เลือกได้แค่ C หรือ A |
| **API / REST** | Application Programming Interface | ช่องทางให้โปรแกรมคุยกัน — REST = stateless ใช้ HTTP verb ตามความหมาย |

### Network (เครือข่าย)
| ศัพท์ | ย่อจาก | ความหมาย & ใช้ทำอะไร |
|--|--|--|
| **IP** | Internet Protocol | ที่อยู่/การส่งแพ็กเก็ตข้ามเครือข่าย (Layer 3) |
| **TCP / UDP** | Transmission Control / User Datagram | TCP=เชื่อถือได้ มี handshake · UDP=เร็ว ไม่รับประกัน (Layer 4) |
| **ICMP** | Internet Control Message Protocol | ส่งข้อความควบคุม/วินิจฉัย (ping, traceroute ใช้) |
| **ARP** | Address Resolution Protocol | หา MAC จาก IP ภายใน LAN เดียวกัน |
| **DNS** | Domain Name System | แปลชื่อโดเมน ↔ IP (สมุดโทรศัพท์อินเทอร์เน็ต, พอร์ต 53) |
| **DHCP** | Dynamic Host Configuration Protocol | แจก IP/subnet/gateway/DNS ให้เครื่องอัตโนมัติ (DORA) |
| **NAT / PAT** | Network Address Translation / Port AT | แปลง private↔public IP · PAT=หลายเครื่องใช้ 1 public IP แยกด้วยพอร์ต |
| **VLAN** | Virtual LAN | แบ่ง broadcast domain เชิงตรรกะบนสวิตช์ |
| **LAN/WAN/MAN** | Local/Wide/Metro Area Network | เครือข่ายระดับท้องถิ่น / กว้าง / เมือง |
| **SDN** | Software-Defined Networking | ควบคุมเครือข่ายด้วยซอฟต์แวร์ (แยก control/data plane) |
| **MTU** | Maximum Transmission Unit | ขนาดแพ็กเก็ตใหญ่สุดที่ส่งได้ (ปกติ 1500 ไบต์) |
| **OSI** | Open Systems Interconnection | แบบจำลองเครือข่าย 7 ชั้นมาตรฐาน |
| **MAC** | Media Access Control | ที่อยู่ฮาร์ดแวร์ NIC (Layer 2, 48 บิต) |
| **CIDR** | Classless Inter-Domain Routing | เขียน prefix แบบ /n (เช่น /24) แทน class เดิม |
| **VLSM / FLSM** | Variable-/Fixed-Length Subnet Mask | แบ่ง subnet ขนาดต่างกัน (VLSM ประหยัด IP) / เท่ากัน (FLSM) |
| **Gateway** | — | ประตูออกสู่เครือข่ายอื่น (มัก = router ตัวแรก) |
| **Firewall** | — | กรองทราฟฟิกตามกฎ (stateful จำ session) |
| **QoS** | Quality of Service | จัดลำดับความสำคัญทราฟฟิก (เช่น VoIP มาก่อน) |
| **RTT / BDP** | Round-Trip Time / Bandwidth-Delay Product | เวลาไป-กลับ / ปริมาณข้อมูลที่กำลังเดินทาง = BW×RTT |

### Dev & Data (พัฒนา & ข้อมูล)
| ศัพท์ | ย่อจาก | ความหมาย & ใช้ทำอะไร |
|--|--|--|
| **CI/CD** | Continuous Integration/Delivery | อัตโนมัติ build+test (CI) และ deploy (CD) — ส่งซอฟต์แวร์บ่อย ปลอดภัย |
| **Git / VCS** | Version Control System | ติดตามประวัติโค้ด แตก branch/merge ย้อนกลับได้ |
| **DevOps** | Development + Operations | วัฒนธรรม+เครื่องมือรวมทีมพัฒนากับปฏิบัติการ ส่งงานเร็วขึ้น |
| **SQL / NoSQL** | Structured Query Language | ฐานข้อมูลเชิงสัมพันธ์ schema ตายตัว (SQL) vs ยืดหยุ่น scale-out (NoSQL) |
| **ACID** | Atomicity/Consistency/Isolation/Durability | คุณสมบัติทรานแซกชันที่เชื่อถือได้ของ RDBMS |
| **CRUD** | Create/Read/Update/Delete | 4 การกระทำพื้นฐานกับข้อมูล |
| **ORM** | Object-Relational Mapping | แปลง object ↔ ตารางฐานข้อมูล ให้เขียน SQL น้อยลง |
| **RISC / CISC** | Reduced/Complex Instruction Set | สถาปัตยกรรม CPU คำสั่งง่าย (ARM) vs ซับซ้อน (x86) |
| **DMA** | Direct Memory Access | ย้ายข้อมูล I/O↔หน่วยความจำโดยไม่ผ่าน CPU ทุกไบต์ |
| **AI / ML / DL** | Artificial Intelligence / Machine / Deep Learning | ปัญญาประดิษฐ์ / เรียนรู้จากข้อมูล / โครงข่ายประสาทลึก |
| **LLM / NLP** | Large Language Model / Natural Language Processing | โมเดลภาษาขนาดใหญ่ / ประมวลผลภาษามนุษย์ |
| **MapReduce** | — | โมเดลประมวลผล big data: Map แตกงาน → Reduce รวมผล |
| **ETL** | Extract-Transform-Load | ดึง-แปลง-โหลดข้อมูลเข้าคลังข้อมูล |
| **Encryption** | — | เข้ารหัสข้อมูล (symmetric กุญแจเดียว / asymmetric คู่กุญแจ) กันคนอ่าน |
| **Hashing** | — | ฟังก์ชันทางเดียว ย้อนกลับไม่ได้ — เก็บรหัสผ่าน/ตรวจ integrity |
| **Salt** | — | ค่าสุ่มเติมก่อนแฮชรหัสผ่าน — กัน rainbow table/แฮชซ้ำ |
| **TLS/SSL** | Transport Layer Security | เข้ารหัสการสื่อสาร (HTTPS=HTTP+TLS) ยืนยันตัวตน+ความลับ+ความถูกต้อง |

---

### ✅ Checklist ก่อนเข้าห้อง
- [ ] ท่องตาราง **2ⁿ** และ **subnet mask (/24–/30)** ให้ขึ้นใจ
- [ ] ฝึกหา Network/Broadcast/VLSM โดยเฉพาะ **prefix /17–/23 (คร่อม octet)**
- [ ] จำ **โมเดล IaaS/PaaS/SaaS** + **ตาราง SLA nines**
- [ ] จำ **พอร์ต** และ **HTTP status/method**
- [ ] จำสูตร **Amdahl, EAT, Little's Law, Entropy, nCr/nPr**
- [ ] หมวด 5 (85 คะแนน) และหมวด 6 (70 คะแนน) = **155/305 คะแนน** → ทุ่มเวลาตรงนี้ก่อน
