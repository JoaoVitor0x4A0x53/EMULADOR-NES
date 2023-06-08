<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emulador nes</title>
    <style>
        body{
            background-color: black;
        }
        button {
            width: 75px;
            height: 35px;
            border: 1px solid white;
            background-color: black;
            color: white;
        }
        h1{
            color: white;
        }
        input {
            width: 200px;
            height: 35px;
            color: black;
        }
        section > p {
            margin: 1px;
            color: white;
        }
    </style>
</head>
<body>
    <main>
        <h1>Digite o binario executavel nes</h1>
        <input type="number" id="codigo" name="input" value="01001110010001010101001100011010000000010000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000001010100101010101">
       <button id="run">executar</button>
    </main>
    <section>
        <p class="p">pc: </p>
        <p class="p">opcode: </p>
        <p class="p">valor: </p>
        <p class="p"></p>
    </section>
    <script>
        function informar(infor){
            this.p = document.getElementsByClassName('p')
            p[0].innerHTML = 'pc -> ' + infor.pc + ' _____ flags --- c: ' + this.flags.C + `  ~  z: ${this.flags.Z}  ~   i: ${this.flags.I}   ~   d: ${this.flags.D}   ~   b: ${this.flags.B}   ~   v: ${this.flags.V}   ~   n: ${this.flags.N} ___ Registradores - - X: ${this.X} - - Y: ${this.Y} - - A: ${this.A}`
            if (infor.err != true){
                p[1].innerHTML = 'opcode -> ' + infor.op
                p[2].innerHTML = 'valor -> !'
            }else {
                p[1].innerHTML = 'opcode -> !'
                p[2].innerHTML = 'valor -> ' + infor.op + ' |||| dex - SP ' + this.SP+ ' |||| hex - SP ' + parseInt(this.SP, 2).toString(16)
            }
        }
        var run = document.getElementById('run')
        var bin = document.getElementById('codigo')
        var binExe = []
        run.addEventListener('click', function(){
            var binario = String(bin.value)
            var executavel = []
            var c1 = true
            var c2 = 0;
            for (var x = 0; x <= (binario.length - 1) / 8; x ++){
                executavel[x] = binario.substr(x * 8, 8)
                if (executavel.length == Math.round((binario.length - 1) / 8)){
                    binExe = executavel
                    alert(binExe)
                    cpu()
                }
            }
        })
        function cpu() {
            this.PC = 0x0000
            this.SP = 0x00
            this.A = 0x00
            this.X = 0x00
            this.Y = 0x00
            this.flags = {
                C: 0,
                Z: 0,
                I: 0,
                D: 0,
                B: 1,
                V: 0,
                N: 0
            }
            this.memoriaCPU = {
                PPU: [],
                APU: [],
                CONTROLLER_1: [],
                CONTROLLER_2: [],
                SRAM: [],
                RAM: [],
                PRG_ROM: []
            }
            formatNES()
        }
        function addressMemoriaCPU(address) {
            /*this.p[3].innerHTML = */alert('endereco dex: ' + address + '  ---  endereco  hex: ' + address.toString(16) + ' ---- rom: ' + parseInt(this.memoriaCPU.PRG_ROM[address - 0x8000], 2).toString(16) + ' --- ram: ' + parseInt(this.memoriaCPU.RAM[address], 2).toString(16) + ' - toda a RAM: '+this.memoriaCPU.RAM)


            if (address < 0x2000){
                return this.memoriaCPU.RAM[address]
            }else if(address < 0x4000){
                return this.memoriaCPU.PPU[address - 0x2000]
            }else if(address == 0x4014){
                return this.memoriaCPU.PPU[address - 0x2000]
            }else if(address == 0x4015){
                return this.memoriaCPU.APU[address - 0x4015]
            }else if(address == 0x4016){
                return this.memoriaCPU.CONTROLLER_1[address - 0x4016]
            }else if(address == 0x4017){
                return this.memoriaCPU.CONTROLLER_2[address - 0x4016]
            }else if(address >= 0x6000 & address < 0x8000){
                return this.memoriaCPU.SRAM[address - 0x6000]
            }else if (address >= 0x8000){
                return this.memoriaCPU.PRG_ROM[address - 0x8000]
            }
        }
        function reset() {
            this.PC = 0xfffc
            this.SP = 0xfd
            clock()
        }
        function formatNES() {
            var iNESFormat = false
            var NES20Format = false
            if (parseInt(this.binExe[0], 2) == 0x4E & parseInt(this.binExe[1], 2) == 0x45 &
            parseInt(this.binExe[2], 2) == 0x53 & parseInt(this.binExe[3], 2) == 0x1A) {
                iNESFormat = true
                if (iNESFormat == true & (parseInt(this.binExe[7], 2) & 0x0C) == 0x08) {
                    NES20Format=true
                    alert('erro format NES 2.0 sem suporte')
                }
            }else {
                alert('erro no formato de arquivo')
            }
            mapper()
        }
        function mapper() { 
            let numeroMapperMSB = String(this.binExe[7].slice(0, 4))
            let numeroMapperLSB = String(this.binExe[6].slice(0, 4))
            let mapperNumero = numeroMapperMSB + numeroMapperLSB
            mapperNumero = parseInt(mapperNumero, 2)

            switch (mapperNumero){
                case 0x00:
                    mapper0()
                break;
                case 0x02:

                break
                default:
                    alert('erro mapper sem suporte')
                break
            }
        }
        function mapper0() {
            var backsPRG_ROM = this.binExe[4]
            var backsCHR_ROM = this.binExe[5]
            var espelhamento = this.binExe[6].slice(7, 8)

            if (parseInt(backsPRG_ROM, 2) != 2) {
                this.memoriaCPU.PRG_ROM = this.binExe // NROM-128
            } else {
                this.memoriaCPU.PRG_ROM = this.binExe.concat(this.binExe) // NROM-256
            }
            reset()
        }
        function opcodes(address){
            address = parseInt(address, 2).toString(16)
            if (address.length == 1) {
                address = `0${address}` // 0 au address para ficar com dois digitos
            }
            var op = {
                '38': sec_implicito, '18': clc_implicito, 'b8': clv_implicito,
                '78': sei_implicito, '58': cli_implicito, 'f8': sed_implicito,
                'd8': cld_implicito, 'a9': lda_imediato,  'a5': lda_zeroPage,
                'b5': lda_zeroPage_x,'ad': lda_absolute,  'bd': lda_absolute_x,
                'b9': lda_absolute_y,'a1': lda_indireto_x,'b1': lda_indireto_y,
                'a2': ldx_imediato,  'a6': ldx_zeroPage,  'b6': ldx_zeroPage_y,
                'ae': ldx_absolute,  'be': ldx_absolute_y,'a0': ldy_imediato,
                'a4': ldy_zeroPage,  'b4': ldy_zeroPage_x,'ac': ldy_absolute,
                'bc': ldy_absolute_x,'85': sta_zeroPage,  '95': sta_zeroPage_x,
                '8d': sta_absolute,  '9d': sta_absolute_x,'99': sta_absolute_y,
                '81': sta_indireto_x,'91': sta_indireto_y,'86': stx_zeroPage,
                '96': stx_zeroPage_y,'8e': stx_absolute,  '84': sty_zeroPage,
                '94': sty_zeroPage_x,'8c': sty_absolute,  'aa': tax_implicito,
                'a8': tay_implicito, 'ba': tsx_implicito, '8a': txa_implicito,
                '9a': txs_implicito, '98': tya_implicito, '69': adc_imediato,
                '65': adc_zeroPage,  '75': adc_zeroPage_x,'6d': adc_absolute,
                '7d': adc_absolute_x,'79': adc_absolute_y,'61': adc_indireto_x,
                '71': adc_indireto_y,'e9': sbc_imediato,  'e5': sbc_zeroPage,
                'f5': sbc_zeroPage_x,'ed': sbc_absolute,  'fd': sbc_absolute_x,
                'f9': sbc_absolute_y,'e1': sbc_indireto_x,'f1': sbc_indireto_y,
                '29': and_imediato,  '25': and_zeroPage,  '35': and_zeroPage_x,
                '2d': and_absolute,  '3d': and_absolute_x,'39': and_absolute_y,
                '21': and_indireto_x,'31': and_indireto_y,'09': ora_imediato,
                '05': ora_zeroPage,  '15': ora_zeroPage_x,'0d': ora_absolute,
                '1d': ora_absolute_x,'19': ora_absolute_y,'01': ora_indireto_x,
                '11': ora_indireto_y,'49': eor_imediato,  '45': eor_zeroPage,
                '55': eor_zeroPage_x,'4d': eor_absolute,  '5d': eor_absolute_x,
                '59': eor_absolute_y,'41': eor_indireto_x,'51': eor_indireto_y,
                'e8': inx_implicito, 'c8': iny_implicito, 'ca': dex_implicito,
                '88': dey_implicito, 'e6': inc_zeroPage,  'f6': inc_zeroPage_x,
                'ee': inc_absolute,  'fe': inc_absolute_x,'c6': dec_zeroPage,
                'd6': dec_zeroPage_x,'ce': dec_absolute,  'de': dec_absolute_x,
                'c9': cmp_imediato,  'c5': cmp_zeroPage,  'd5': cmp_zeroPage_x,
                'cd': cmp_absolute,  'dd': cmp_absolute_x,'d9': cmp_absolute_y,
                'c1': cmp_indireto_x,'d1': cmp_indireto_y,'e0': cpx_imediato,
                'e4': cpx_zeroPage,  'ec': cpx_absolute,  'c0': cpy_imediato,
                'c4': cpy_zeroPage,  'cc': cpy_absolute,  '24': bit_zeroPage,
                '2c': bit_absolute,  '4a': lsr_acumulador,'46': lsr_zeroPage,
                '56': lsr_zeroPage_x,'4e': lsr_absolute,  '5e': lsr_absolute_x,
                '0a': asl_acumulador,'06': asl_zeroPage,  '16': asl_zeroPage_x,
                '0e': asl_absolute,  '1e': asl_absolute_x,'2a': rol_acumulador,
                '26': rol_zeroPage,  '36': rol_zeroPage_x,'2e': rol_absolute,
                '3e': rol_absolute_x,'6a': ror_acumulador,'66': ror_zeroPage,
                '76': ror_zeroPage_x,'6e': ror_absolute,  '7e': ror_absolute_x
            }
            return op[address]
        }
        function cyles() {
            cycles = [
                2
            ]
        }
        function clock() {
            var timerClock = 100
            this.PC = 0x8011
            setInterval(function(){
                try {
                    var dado = addressMemoriaCPU(this.PC)
                    opcodes(dado)()
                    informar({op: parseInt(dado, 2).toString(16), err: false, pc: this.PC.toString(16)})
                }catch (erro) {
                    informar({op: parseInt(dado, 2).toString(16), err: true, pc: this.PC.toString(16)})
                }
                this.PC >= 0xFFFF ? this.PC = 0 : this.PC ++
            }, timerClock)
        }
        function sec_implicito() {
            this.flags.C = 1
        }
        function clc_implicito() {
            this.flags.C = 0
        }
        function clv_implicito() {
            this.flags.V = 1
        }
        function sei_implicito() {
            this.flags.I = 1
        }
        function cli_implicito() {
            this.flags.I = 0
        }
        function sed_implicito() {
            this.flags.D = 1
        }
        function cld_implicito() {
            this.flags.C = 0
        }
        function lda_imediato() {
            this.A = addressMemoriaCPU(this.PC += 1)
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
        }
        function lda_zeroPage() {
            // this.memoriaCPU.RAM[0x55] = '00100000' // 20
            this.A = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
        }
        function lda_zeroPage_x() {
            // this.X = '00000101'
            // this.memoriaCPU.RAM[0x55] = '00100000' // 20
            this.A = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2) + parseInt(this.X, 2))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
        }
        function lda_absolute() {
            // this.memoriaCPU.PRG_ROM[0x4000] = '00100000' // 20
            this.A = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)), 2))
            this.PC += 1
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
        }
        function lda_absolute_x() {
            // this.X = '0000001'
            // this.memoriaCPU.PRG_ROM[0x4000] = '00100000' // 20
            this.A = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.X, 2))
            this.PC += 1
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
        }
        function lda_absolute_y() {
            // this.Y = '00000001'
            // this.memoriaCPU.PRG_ROM[0x4000] = '00100000' // 20
            this.A = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.Y, 2))
            this.PC += 1
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
        }
        function lda_indireto_x() {
            // this.X = '00000001'
            // this.memoriaCPU.RAM[0x55] = '00000000'
            // this.memoriaCPU.RAM[0x56] = '11000000'
            // this.memoriaCPU.PRG_ROM[0x4000] = '00100000' // 20
            var address_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2) + parseInt(this.X, 2))
            var address_2 = addressMemoriaCPU((parseInt(addressMemoriaCPU(this.PC), 2) + parseInt(this.X)) + 1)
            this.A = addressMemoriaCPU(parseInt(address_2.concat(address_1), 2))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
        }
        function lda_indireto_y() {
            // this.Y = '00000001'
            // this.memoriaCPU.RAM[0x55] = '11111111'
            // this.memoriaCPU.RAM[0x56] = '10111111'
            // this.memoriaCPU.PRG_ROM[0x4000] = '00100000' // 20
            var address_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2))
            var address_2 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC), 2) + 1)
            this.A = addressMemoriaCPU(parseInt(address_2.concat(address_1), 2) + parseInt(this.Y, 2))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
        }
        function ldx_imediato() {
            this.X = addressMemoriaCPU(this.PC += 1)
            if (parseInt(this.X, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.X.slice(0, 1)
        }
        function ldx_zeroPage() {
            this.X = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2))
            if (parseInt(this.X, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.X.slice(0, 1)
        }
        function ldx_zeroPage_y() {
            this.X = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2) + parseInt(this.Y, 2))
            if (parseInt(this.X, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.X.slice(0, 1)
        }
        function ldx_absolute() {
            this.X = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)), 2))
            this.PC += 1
            if (parseInt(this.X, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.X.slice(0, 1)
        }
        function ldx_absolute_y() {
            // this.Y = '00000001'
            // this.memoriaCPU.PRG_ROM[0x4000] = '11110000' // -240
            this.X = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.Y, 2))
            this.PC += 1
            if (parseInt(this.X, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.X.slice(0, 1)
            // alert(this.X + ' /// ' + parseInt(this.X, 2).toString(16))
        }
        function ldy_imediato() {
            this.Y = addressMemoriaCPU(this.PC += 1)
            if (parseInt(this.Y, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.Y.slice(0, 1)
        }
        function ldy_zeroPage() {
            this.Y = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2))
            if (parseInt(this.Y, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.Y.slice(0, 1)
        }
        function ldy_zeroPage_x() {
            this.Y = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2) + parseInt(this.X, 2))
            if (parseInt(this.Y, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.Y.slice(0, 1)
        }
        function ldy_absolute() {
            this.Y = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)), 2))
            this.PC += 1
            if (parseInt(this.Y, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.Y.slice(0, 1)
        }
        function ldy_absolute_x() {
            this.Y = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.X, 2))
            this.PC += 1
            if (parseInt(this.Y, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.Y.slice(0, 1)
        }
        function sta_zeroPage() {
            var address = parseInt(addressMemoriaCPU(this.PC += 1), 2)
            // alert(address)
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = this.A
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = this.A
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = this.A
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = this.A
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = this.A
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = this.A
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = this.A
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = this.A
            }
            // alert(this.memoriaCPU.RAM[address])
        }
        function sta_zeroPage_x() {
            var address = parseInt(addressMemoriaCPU(this.PC += 1), 2) + parseInt(this.X, 2)
            // alert(address)
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = this.A
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = this.A
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = this.A
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = this.A
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = this.A
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = this.A
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = this.A
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = this.A
            }
            // alert(this.memoriaCPU.RAM[address])
        }
        function sta_absolute() {
            var address = parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)), 2)
            this.PC += 1
            // alert(address.toString(16))
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = this.A
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = this.A
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = this.A
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = this.A
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = this.A
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = this.A
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = this.A
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = this.A
            }
            // alert(this.memoriaCPU.RAM[address])
        }
        function sta_absolute_x() {
            var address = parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)), 2) + parseInt(this.X, 2)
            this.PC += 1
            // alert(address.toString(16))
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = this.A
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = this.A
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = this.A
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = this.A
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = this.A
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = this.A
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = this.A
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = this.A
            }
            // alert(this.memoriaCPU.RAM[address])
        }
        function sta_absolute_y() {
            var address = parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)), 2) + parseInt(this.Y, 2)
            this.PC += 1
            // alert(address.toString(16))
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = this.A
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = this.A
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = this.A
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = this.A
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = this.A
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = this.A
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = this.A
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = this.A
            }
            // alert(this.memoriaCPU.RAM[address])
        }
        function sta_indireto_x() {
            // this.memoriaCPU.RAM[0xfe] = '11111111' // 8fff
            // this.memoriaCPU.RAM[0xff] = '10001111'
            var address_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2) + parseInt(this.X, 2))
            var address_2 = addressMemoriaCPU((parseInt(addressMemoriaCPU(this.PC), 2) + parseInt(this.X)) + 1)
            var address = parseInt(address_2.concat(address_1), 2)
            // alert(address.toString(16))
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = this.A
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = this.A
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = this.A
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = this.A
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = this.A
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = this.A
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = this.A
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = this.A
            }
            //alert(this.memoriaCPU.PRG_ROM[address - 0x8000])
        }
        function sta_indireto_y() {
            // this.memoriaCPU.RAM[0xfe] = '11111111' // 8fff
            // this.memoriaCPU.RAM[0xff] = '10001111'
            var address_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2))
            var address_2 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC), 2) + 1)
            var address = parseInt(address_2.concat(address_1), 2) + parseInt(this.Y, 2)
            // alert(address.toString(16))
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = this.A
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = this.A
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = this.A
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = this.A
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = this.A
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = this.A
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = this.A
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = this.A
            }
            // alert(this.memoriaCPU.PRG_ROM[address - 0x8000])
        }
        function stx_zeroPage() {
            var address = parseInt(addressMemoriaCPU(this.PC += 1), 2)
            // alert(address)
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = this.X
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = this.X
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = this.X
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = this.X
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = this.X
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = this.X
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = this.X
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = this.X
            }
            // alert(this.memoriaCPU.RAM[address])  
        }
        function stx_zeroPage_y() {
            var address = parseInt(addressMemoriaCPU(this.PC += 1), 2) + parseInt(this.Y, 2)
            // alert(address)
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = this.X
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = this.X
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = this.X
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = this.X
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = this.X
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = this.X
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = this.X
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = this.X
            }
            // alert(this.memoriaCPU.RAM[address])
        }
        function stx_absolute() {
            var address = parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)), 2)
            this.PC += 1
            // alert(address.toString(16))
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = this.X
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = this.X
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = this.X
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = this.X
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = this.X
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = this.X
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = this.X
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = this.X
            }
            // alert(this.memoriaCPU.PRG_ROM[address - 0x8000])
        }
        function sty_zeroPage() {
            var address = parseInt(addressMemoriaCPU(this.PC += 1), 2)
            // alert(address)
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = this.Y
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = this.Y
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = this.Y
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = this.Y
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = this.Y
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = this.Y
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = this.Y
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = this.Y
            }
            // alert(this.memoriaCPU.RAM[address])  
        }
        function sty_zeroPage_x() {
            var address = parseInt(addressMemoriaCPU(this.PC += 1), 2) + parseInt(this.X, 2)
            // alert(address)
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = this.Y
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = this.Y
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = this.Y
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = this.Y
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = this.Y
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = this.Y
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = this.Y
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = this.Y
            }
            // alert(this.memoriaCPU.RAM[address])
        }
        function sty_absolute() {
            var address = parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)), 2)
            this.PC += 1
            // alert(address.toString(16))
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = this.Y
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = this.Y
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = this.Y
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = this.Y
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = this.Y
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = this.Y
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = this.Y
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = this.Y
            }
            // alert(this.memoriaCPU.PRG_ROM[address - 0x8000])
        }
        function tax_implicito() {
            this.X = this.A
            if (parseInt(this.X, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.X.slice(0, 1)
        }
        function tay_implicito() {
            this.Y = this.A
            if (parseInt(this.Y, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.Y.slice(0, 1)
        }
        function tsx_implicito() {
            this.X = parseInt(this.SP, 16).toString(2).padStart(8, '0')
            if (parseInt(this.X, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.X.slice(0, 1)
        }
        function txa_implicito() {
            this.A = this.X
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function txs_implicito() {
            this.SP = parseInt(this.X, 2).toString(16)
        }
        function tya_implicito() {
            this.A = this.Y
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function adc_imediato() {
            var valor_1 = addressMemoriaCPU(this.PC += 1)
            var valor_complemento_2
            var a_complemento_2
            valor_complemento_2 = valor_1.slice(0, 1)
            a_complemento_2 = this.A.slice(0, 1)
            var resultado = ((parseInt(this.A, 2) + parseInt(valor_1, 2)) + this.flags.C).toString(2).padStart(8, '0')
            this.A = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            if (parseInt(resultado, 2) > 255){
                this.flags.C = 1
            }else {
                this.flags.C = 0
            }
            this.flags.N = this.A.slice(0, 1)
            if (valor_complemento_2 == 0 & a_complemento_2 == 0 & parseInt(this.A, 2) > 127){
                this.flags.V = 1
            }else if (valor_complemento_2 == 1 & a_complemento_2 == 1 & parseInt(this.A, 2) < 128){
                this.flags.V = 1
            }else {
                this.flags.V = 0
            }
        }
        function adc_zeroPage() {
            // this.memoriaCPU.RAM[0xff] = '00000001'
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2))
            var valor_complemento_2
            var a_complemento_2
            valor_complemento_2 = valor_1.slice(0, 1)
            a_complemento_2 = this.A.slice(0, 1)
            var resultado = ((parseInt(this.A, 2) + parseInt(valor_1, 2)) + this.flags.C).toString(2).padStart(8, '0')
            this.A = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            if (parseInt(resultado, 2) > 255){
                this.flags.C = 1
            }else {
                this.flags.C = 0
            }
            this.flags.N = this.A.slice(0, 1)
            if (valor_complemento_2 == 0 & a_complemento_2 == 0 & parseInt(this.A, 2) > 127){
                this.flags.V = 1
            }else if (valor_complemento_2 == 1 & a_complemento_2 == 1 & parseInt(this.A, 2) < 128){
                this.flags.V = 1
            }else {
                this.flags.V = 0
            }
        }
        function adc_zeroPage_x() {
            // this.memoriaCPU.RAM[0xff] = '11111111'
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2) + parseInt(this.X, 2))
            var valor_complemento_2
            var a_complemento_2
            valor_complemento_2 = valor_1.slice(0, 1)
            a_complemento_2 = this.A.slice(0, 1)
            var resultado = ((parseInt(this.A, 2) + parseInt(valor_1, 2)) + this.flags.C).toString(2).padStart(8, '0')
            this.A = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            if (parseInt(resultado, 2) > 255){
                this.flags.C = 1
            }else {
                this.flags.C = 0
            }
            this.flags.N = this.A.slice(0, 1)
            if (valor_complemento_2 == 0 & a_complemento_2 == 0 & parseInt(this.A, 2) > 127){
                this.flags.V = 1
            }else if (valor_complemento_2 == 1 & a_complemento_2 == 1 & parseInt(this.A, 2) < 128){
                this.flags.V = 1
            }else {
                this.flags.V = 0
            }
        }
        function adc_absolute() {
            //this.memoriaCPU.PRG_ROM[0x4000] = '11111111'
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)), 2))
            var valor_complemento_2
            var a_complemento_2
            valor_complemento_2 = valor_1.slice(0, 1)
            a_complemento_2 = this.A.slice(0, 1)
            this.PC += 1
            var resultado = ((parseInt(this.A, 2) + parseInt(valor_1, 2)) + this.flags.C).toString(2).padStart(8, '0')
            this.A = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            //alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            if (parseInt(resultado, 2) > 255){
                this.flags.C = 1
            }else {
                this.flags.C = 0
            }
            this.flags.N = this.A.slice(0, 1)
            if (valor_complemento_2 == 0 & a_complemento_2 == 0 & parseInt(this.A, 2) > 127){
                this.flags.V = 1
            }else if (valor_complemento_2 == 1 & a_complemento_2 == 1 & parseInt(this.A, 2) < 128){
                this.flags.V = 1
            }else {
                this.flags.V = 0
            }
        }
        function adc_absolute_x() {
            // this.memoriaCPU.PRG_ROM[0x4000] = '11111111'
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.X, 2))
            var valor_complemento_2
            var a_complemento_2
            valor_complemento_2 = valor_1.slice(0, 1)
            a_complemento_2 = this.A.slice(0, 1)
            this.PC += 1
            var resultado = ((parseInt(this.A, 2) + parseInt(valor_1, 2)) + this.flags.C).toString(2).padStart(8, '0')
            this.A = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            if (parseInt(resultado, 2) > 255){
                this.flags.C = 1
            }else {
                this.flags.C = 0
            }
            this.flags.N = this.A.slice(0, 1)
            if (valor_complemento_2 == 0 & a_complemento_2 == 0 & parseInt(this.A, 2) > 127){
                this.flags.V = 1
            }else if (valor_complemento_2 == 1 & a_complemento_2 == 1 & parseInt(this.A, 2) < 128){
                this.flags.V = 1
            }else {
                this.flags.V = 0
            }
        }
        function adc_absolute_y() {
            // this.memoriaCPU.PRG_ROM[0x4000] = '11111111'
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.Y, 2))
            var valor_complemento_2
            var a_complemento_2
            valor_complemento_2 = valor_1.slice(0, 1)
            a_complemento_2 = this.A.slice(0, 1)
            this.PC += 1
            var resultado = ((parseInt(this.A, 2) + parseInt(valor_1, 2)) + this.flags.C).toString(2).padStart(8, '0')
            this.A = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            if (parseInt(resultado, 2) > 255){
                this.flags.C = 1
            }else {
                this.flags.C = 0
            }
            this.flags.N = this.A.slice(0, 1)
            if (valor_complemento_2 == 0 & a_complemento_2 == 0 & parseInt(this.A, 2) > 127){
                this.flags.V = 1
            }else if (valor_complemento_2 == 1 & a_complemento_2 == 1 & parseInt(this.A, 2) < 128){
                this.flags.V = 1
            }else {
                this.flags.V = 0
            }
        }
        function adc_indireto_x() {
            // this.memoriaCPU.RAM[0xfe] = '00000000'
            // this.memoriaCPU.RAM[0xff] = '11000000'
            // this.memoriaCPU.PRG_ROM[0x4000] = '11111111'
            var address_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2) + parseInt(this.X, 2))
            var address_2 = addressMemoriaCPU((parseInt(addressMemoriaCPU(this.PC), 2) + parseInt(this.X)) + 1)
            var valor_1 = addressMemoriaCPU(parseInt(address_2.concat(address_1), 2))
            var valor_complemento_2
            var a_complemento_2
            valor_complemento_2 = valor_1.slice(0, 1)
            a_complemento_2 = this.A.slice(0, 1)
            var resultado = ((parseInt(this.A, 2) + parseInt(valor_1, 2)) + this.flags.C).toString(2).padStart(8, '0')
            this.A = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            if (parseInt(resultado, 2) > 255){
                this.flags.C = 1
            }else {
                this.flags.C = 0
            }
            this.flags.N = this.A.slice(0, 1)
            if (valor_complemento_2 == 0 & a_complemento_2 == 0 & parseInt(this.A, 2) > 127){
                this.flags.V = 1
            }else if (valor_complemento_2 == 1 & a_complemento_2 == 1 & parseInt(this.A, 2) < 128){
                this.flags.V = 1
            }else {
                this.flags.V = 0
            }
        }
        function adc_indireto_y() {
            // this.memoriaCPU.RAM[0xfe] = '11111111' 
            // this.memoriaCPU.RAM[0xff] = '10111111'
            // this.memoriaCPU.PRG_ROM[0x4000] = '11111111'
            var address_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2))
            var address_2 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC), 2) + 1)
            var valor_1 = addressMemoriaCPU(parseInt(address_2.concat(address_1), 2) + parseInt(this.Y, 2))
            var valor_complemento_2
            var a_complemento_2
            valor_complemento_2 = valor_1.slice(0, 1)
            a_complemento_2 = this.A.slice(0, 1)
            var resultado = ((parseInt(this.A, 2) + parseInt(valor_1, 2)) + this.flags.C).toString(2).padStart(8, '0')
            this.A = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            if (parseInt(resultado, 2) > 255){
                this.flags.C = 1
            }else {
                this.flags.C = 0
            }
            this.flags.N = this.A.slice(0, 1)
            if (valor_complemento_2 == 0 & a_complemento_2 == 0 & parseInt(this.A, 2) > 127){
                this.flags.V = 1
            }else if (valor_complemento_2 == 1 & a_complemento_2 == 1 & parseInt(this.A, 2) < 128){
                this.flags.V = 1
            }else {
                this.flags.V = 0
            }
        }
        function sbc_imediato() {
            var valor_1 = addressMemoriaCPU(this.PC += 1)
            var valor_complemento_2
            var a_complemento_2
            valor_complemento_2 = valor_1.slice(0, 1)
            a_complemento_2 = this.A.slice(0, 1)
            var resultado = (parseInt(this.A, 2) - parseInt(valor_1, 2)) - (this.flags.C == 1 ? 0 : this.flags.C = 1)
            // alert(resultado)
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0') // tirar negativo
                // alert(resultado)
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            if (parseInt(this.A, 2) < parseInt(valor_1, 2)){ 
                // bug flag C na cpu original
                this.flags.C = 0
            }else {
                this.flags.C = 1
            }
            this.A = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
            if (valor_complemento_2 == 1 & a_complemento_2 == 0 & parseInt(this.A, 2) > 127){
                this.flags.V = 1
            }else if (valor_complemento_2 == 0 & a_complemento_2 == 1 & parseInt(this.A, 2) < 128){
                this.flags.V = 1
            }else {
                this.flags.V = 0
            }
        }
        function sbc_zeroPage() {
            //this.memoriaCPU.RAM[0xff] = '11111111'
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2))
            var valor_complemento_2
            var a_complemento_2
            valor_complemento_2 = valor_1.slice(0, 1)
            a_complemento_2 = this.A.slice(0, 1)
            var resultado = (parseInt(this.A, 2) - parseInt(valor_1, 2)) - (this.flags.C == 1 ? 0 : this.flags.C = 1)
            //alert(resultado)
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0') // tirar negativo
                //alert(resultado)
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            if (parseInt(this.A, 2) < parseInt(valor_1, 2)){ 
                // bug flag C na cpu original
                this.flags.C = 0
            }else {
                this.flags.C = 1
            }
            this.A = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            //alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
            if (valor_complemento_2 == 1 & a_complemento_2 == 0 & parseInt(this.A, 2) > 127){
                this.flags.V = 1
            }else if (valor_complemento_2 == 0 & a_complemento_2 == 1 & parseInt(this.A, 2) < 128){
                this.flags.V = 1
            }else {
                this.flags.V = 0
            }
        }
        function sbc_zeroPage_x() {
            // this.memoriaCPU.RAM[0xff] = '01000000'
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2) + parseInt(this.X, 2))
            var valor_complemento_2
            var a_complemento_2
            valor_complemento_2 = valor_1.slice(0, 1)
            a_complemento_2 = this.A.slice(0, 1)
            var resultado = (parseInt(this.A, 2) - parseInt(valor_1, 2)) - (this.flags.C == 1 ? 0 : this.flags.C = 1)
            // alert(resultado)
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0') // tirar negativo
                // alert(resultado)
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            if (parseInt(this.A, 2) < parseInt(valor_1, 2)){ 
                // bug flag C na cpu original
                this.flags.C = 0
            }else {
                this.flags.C = 1
            }
            this.A = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
            if (valor_complemento_2 == 1 & a_complemento_2 == 0 & parseInt(this.A, 2) > 127){
                this.flags.V = 1
            }else if (valor_complemento_2 == 0 & a_complemento_2 == 1 & parseInt(this.A, 2) < 128){
                this.flags.V = 1
            }else {
                this.flags.V = 0
            }
        }
        function sbc_absolute() {
            // this.memoriaCPU.PRG_ROM[0x4000] = '11111111'
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)), 2))
            var valor_complemento_2
            var a_complemento_2
            valor_complemento_2 = valor_1.slice(0, 1)
            a_complemento_2 = this.A.slice(0, 1)
            this.PC += 1
            var resultado = (parseInt(this.A, 2) - parseInt(valor_1, 2)) - (this.flags.C == 1 ? 0 : this.flags.C = 1)
            // alert(resultado)
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0') // tirar negativo
                // alert(resultado)
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            if (parseInt(this.A, 2) < parseInt(valor_1, 2)){ 
                // bug flag C na cpu original
                this.flags.C = 0
            }else {
                this.flags.C = 1
            }
            this.A = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
            if (valor_complemento_2 == 1 & a_complemento_2 == 0 & parseInt(this.A, 2) > 127){
                this.flags.V = 1
            }else if (valor_complemento_2 == 0 & a_complemento_2 == 1 & parseInt(this.A, 2) < 128){
                this.flags.V = 1
            }else {
                this.flags.V = 0
            }
        }
        function sbc_absolute_x() {
            // this.memoriaCPU.PRG_ROM[0x4000] = '10011001'
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.X, 2))
            var valor_complemento_2
            var a_complemento_2
            valor_complemento_2 = valor_1.slice(0, 1)
            a_complemento_2 = this.A.slice(0, 1)
            this.PC += 1
            var resultado = (parseInt(this.A, 2) - parseInt(valor_1, 2)) - (this.flags.C == 1 ? 0 : this.flags.C = 1)
            // alert(resultado)
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0') // tirar negativo
                // alert(resultado)
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            if (parseInt(this.A, 2) < parseInt(valor_1, 2)){ 
                // bug flag C na cpu original
                this.flags.C = 0
            }else {
                this.flags.C = 1
            }
            this.A = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
            if (valor_complemento_2 == 1 & a_complemento_2 == 0 & parseInt(this.A, 2) > 127){
                this.flags.V = 1
            }else if (valor_complemento_2 == 0 & a_complemento_2 == 1 & parseInt(this.A, 2) < 128){
                this.flags.V = 1
            }else {
                this.flags.V = 0
            }
        }
        function sbc_absolute_y() {
            // this.memoriaCPU.PRG_ROM[0x4000] = '10011001'
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.Y, 2))
            var valor_complemento_2
            var a_complemento_2
            valor_complemento_2 = valor_1.slice(0, 1)
            a_complemento_2 = this.A.slice(0, 1)
            this.PC += 1
            var resultado = (parseInt(this.A, 2) - parseInt(valor_1, 2)) - (this.flags.C == 1 ? 0 : this.flags.C = 1)
            // alert(resultado)
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0') // tirar negativo
                // alert(resultado)
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            if (parseInt(this.A, 2) < parseInt(valor_1, 2)){ 
                // bug flag C na cpu original
                this.flags.C = 0
            }else {
                this.flags.C = 1
            }
            this.A = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
            if (valor_complemento_2 == 1 & a_complemento_2 == 0 & parseInt(this.A, 2) > 127){
                this.flags.V = 1
            }else if (valor_complemento_2 == 0 & a_complemento_2 == 1 & parseInt(this.A, 2) < 128){
                this.flags.V = 1
            }else {
                this.flags.V = 0
            }
        }
        function sbc_indireto_x() {
            // this.memoriaCPU.RAM[0xfe] = '00000000'
            // this.memoriaCPU.RAM[0xff] = '11000000'
            // this.memoriaCPU.PRG_ROM[0x4000] = '11111111'
            var address_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2) + parseInt(this.X, 2))
            var address_2 = addressMemoriaCPU((parseInt(addressMemoriaCPU(this.PC), 2) + parseInt(this.X)) + 1)
            var valor_1 = addressMemoriaCPU(parseInt(address_2.concat(address_1), 2))
            var valor_complemento_2
            var a_complemento_2
            valor_complemento_2 = valor_1.slice(0, 1)
            a_complemento_2 = this.A.slice(0, 1)
            var resultado = (parseInt(this.A, 2) - parseInt(valor_1, 2)) - (this.flags.C == 1 ? 0 : this.flags.C = 1)
            // alert(resultado)
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0') // tirar negativo
                // alert(resultado)
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            if (parseInt(this.A, 2) < parseInt(valor_1, 2)){ 
                // bug flag C na cpu original
                this.flags.C = 0
            }else {
                this.flags.C = 1
            }
            this.A = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
            if (valor_complemento_2 == 1 & a_complemento_2 == 0 & parseInt(this.A, 2) > 127){
                this.flags.V = 1
            }else if (valor_complemento_2 == 0 & a_complemento_2 == 1 & parseInt(this.A, 2) < 128){
                this.flags.V = 1
            }else {
                this.flags.V = 0
            }
        }
        function sbc_indireto_y() {
            // this.memoriaCPU.RAM[0xfe] = '11111111' 
            // this.memoriaCPU.RAM[0xff] = '10111111'
            // this.memoriaCPU.PRG_ROM[0x4000] = '11111111'
            var address_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2))
            var address_2 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC), 2) + 1)
            var valor_1 = addressMemoriaCPU(parseInt(address_2.concat(address_1), 2) + parseInt(this.Y, 2))
            var valor_complemento_2
            var a_complemento_2
            valor_complemento_2 = valor_1.slice(0, 1)
            a_complemento_2 = this.A.slice(0, 1)
            var resultado = (parseInt(this.A, 2) - parseInt(valor_1, 2)) - (this.flags.C == 1 ? 0 : this.flags.C = 1)
            // alert(resultado)
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0') // tirar negativo
                // alert(resultado)
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            if (parseInt(this.A, 2) < parseInt(valor_1, 2)){ 
                // bug flag C na cpu original
                this.flags.C = 0
            }else {
                this.flags.C = 1
            }
            this.A = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
            if (valor_complemento_2 == 1 & a_complemento_2 == 0 & parseInt(this.A, 2) > 127){
                this.flags.V = 1
            }else if (valor_complemento_2 == 0 & a_complemento_2 == 1 & parseInt(this.A, 2) < 128){
                this.flags.V = 1
            }else {
                this.flags.V = 0
            }
        }
        function and_imediato() {
            var valor_1 = addressMemoriaCPU(this.PC += 1)
            var novoBin = ''
            for (var x = 0; x < 8; x++){
                if (this.A[x] == 1 & valor_1[x] == 1){
                    novoBin += '1'
                }else {
                    novoBin += '0'
                }
                if (novoBin.length == 8){
                    this.A = novoBin
                }
            }
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function and_zeroPage() {
            // this.memoriaCPU.RAM[0xff] = '11111111'
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2))
            var novoBin = ''
            for (var x = 0; x < 8; x++){
                if (this.A[x] == 1 & valor_1[x] == 1){
                    novoBin += '1'
                }else {
                    novoBin += '0'
                }
                if (novoBin.length == 8){
                    this.A = novoBin
                }
            }
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function and_zeroPage_x() {
            // this.memoriaCPU.RAM[0xff] = '11111111'
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2) + parseInt(this.X, 2))
            var novoBin = ''
            for (var x = 0; x < 8; x++){
                if (this.A[x] == 1 & valor_1[x] == 1){
                    novoBin += '1'
                }else {
                    novoBin += '0'
                }
                if (novoBin.length == 8){
                    this.A = novoBin
                }
            }
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function and_absolute() {
            // this.memoriaCPU.PRG_ROM[0x4000] = '11111111'
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)), 2))
            this.PC += 1
            var novoBin = ''
            for (var x = 0; x < 8; x++){
                if (this.A[x] == 1 & valor_1[x] == 1){
                    novoBin += '1'
                }else {
                    novoBin += '0'
                }
                if (novoBin.length == 8){
                    this.A = novoBin
                }
            }
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function and_absolute_x() {
            // this.memoriaCPU.PRG_ROM[0x4000] = '11111111'
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.X, 2))
            this.PC += 1
            var novoBin = ''
            for (var x = 0; x < 8; x++){
                if (this.A[x] == 1 & valor_1[x] == 1){
                    novoBin += '1'
                }else {
                    novoBin += '0'
                }
                if (novoBin.length == 8){
                    this.A = novoBin
                }
            }
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function and_absolute_y() {
            // this.memoriaCPU.PRG_ROM[0x4000] = '11111111'
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.Y, 2))
            this.PC += 1
            var novoBin = ''
            for (var x = 0; x < 8; x++){
                if (this.A[x] == 1 & valor_1[x] == 1){
                    novoBin += '1'
                }else {
                    novoBin += '0'
                }
                if (novoBin.length == 8){
                    this.A = novoBin
                }
            }
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function and_indireto_x() {
            // this.memoriaCPU.RAM[0xfe] = '00000000'
            // this.memoriaCPU.RAM[0xff] = '11000000'
            // this.memoriaCPU.PRG_ROM[0x4000] = '11111111'
            var address_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2) + parseInt(this.X, 2))
            var address_2 = addressMemoriaCPU((parseInt(addressMemoriaCPU(this.PC), 2) + parseInt(this.X)) + 1)
            var valor_1 = addressMemoriaCPU(parseInt(address_2.concat(address_1), 2))
            var novoBin = ''
            for (var x = 0; x < 8; x++){
                if (this.A[x] == 1 & valor_1[x] == 1){
                    novoBin += '1'
                }else {
                    novoBin += '0'
                }
                if (novoBin.length == 8){
                    this.A = novoBin
                }
            }
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function and_indireto_y() {
            // this.memoriaCPU.RAM[0xfe] = '11111111' 
            // this.memoriaCPU.RAM[0xff] = '10111111'
            // this.memoriaCPU.PRG_ROM[0x4000] = '11111111'
            var address_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2))
            var address_2 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC), 2) + 1)
            var valor_1 = addressMemoriaCPU(parseInt(address_2.concat(address_1), 2) + parseInt(this.Y, 2))
            var novoBin = ''
            for (var x = 0; x < 8; x++){
                if (this.A[x] == 1 & valor_1[x] == 1){
                    novoBin += '1'
                }else {
                    novoBin += '0'
                }
                if (novoBin.length == 8){
                    this.A = novoBin
                }
            }
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function ora_imediato() {
            var valor_1 = addressMemoriaCPU(this.PC += 1)
            var novoBin = ''
            for (var x = 0; x < 8; x++){
                if (this.A[x] == 0 & valor_1[x] == 0){
                    novoBin += '0'
                }else {
                    novoBin += '1'
                }
                if (novoBin.length == 8){
                    this.A = novoBin
                }
            }
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function ora_zeroPage() {
            // this.memoriaCPU.RAM[0xff] = '11111111'
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2))
            var novoBin = ''
            for (var x = 0; x < 8; x++){
                if (this.A[x] == 0 & valor_1[x] == 0){
                    novoBin += '0'
                }else {
                    novoBin += '1'
                }
                if (novoBin.length == 8){
                    this.A = novoBin
                }
            }
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function ora_zeroPage_x() {
            // this.memoriaCPU.RAM[0xff] = '11111111'
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2) + parseInt(this.X, 2))
            var novoBin = ''
            for (var x = 0; x < 8; x++){
                if (this.A[x] == 0 & valor_1[x] == 0){
                    novoBin += '0'
                }else {
                    novoBin += '1'
                }
                if (novoBin.length == 8){
                    this.A = novoBin
                }
            }
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function ora_absolute() {
            // this.memoriaCPU.PRG_ROM[0x4000] = '11111111'
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)), 2))
            this.PC += 1
            var novoBin = ''
            for (var x = 0; x < 8; x++){
                if (this.A[x] == 0 & valor_1[x] == 0){
                    novoBin += '0'
                }else {
                    novoBin += '1'
                }
                if (novoBin.length == 8){
                    this.A = novoBin
                }
            }
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function ora_absolute_x() {
            // this.memoriaCPU.PRG_ROM[0x4000] = '11111111'
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.X, 2))
            this.PC += 1
            var novoBin = ''
            for (var x = 0; x < 8; x++){
                if (this.A[x] == 0 & valor_1[x] == 0){
                    novoBin += '0'
                }else {
                    novoBin += '1'
                }
                if (novoBin.length == 8){
                    this.A = novoBin
                }
            }
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function ora_absolute_y() {
            // this.memoriaCPU.PRG_ROM[0x4000] = '11111111'
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.Y, 2))
            this.PC += 1
            var novoBin = ''
            for (var x = 0; x < 8; x++){
                if (this.A[x] == 0 & valor_1[x] == 0){
                    novoBin += '0'
                }else {
                    novoBin += '1'
                }
                if (novoBin.length == 8){
                    this.A = novoBin
                }
            }
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function ora_indireto_x() {
            // this.memoriaCPU.RAM[0xfe] = '00000000'
            // this.memoriaCPU.RAM[0xff] = '11000000'
            // this.memoriaCPU.PRG_ROM[0x4000] = '11111111'
            var address_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2) + parseInt(this.X, 2))
            var address_2 = addressMemoriaCPU((parseInt(addressMemoriaCPU(this.PC), 2) + parseInt(this.X)) + 1)
            var valor_1 = addressMemoriaCPU(parseInt(address_2.concat(address_1), 2))
            var novoBin = ''
            for (var x = 0; x < 8; x++){
                if (this.A[x] == 0 & valor_1[x] == 0){
                    novoBin += '0'
                }else {
                    novoBin += '1'
                }
                if (novoBin.length == 8){
                    this.A = novoBin
                }
            }
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function ora_indireto_y() {
            // this.memoriaCPU.RAM[0xfe] = '11111111' 
            // this.memoriaCPU.RAM[0xff] = '10111111'
            // this.memoriaCPU.PRG_ROM[0x4000] = '11111111'
            var address_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2))
            var address_2 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC), 2) + 1)
            var valor_1 = addressMemoriaCPU(parseInt(address_2.concat(address_1), 2) + parseInt(this.Y, 2))
            var novoBin = ''
            for (var x = 0; x < 8; x++){
                if (this.A[x] == 0 & valor_1[x] == 0){
                    novoBin += '0'
                }else {
                    novoBin += '1'
                }
                if (novoBin.length == 8){
                    this.A = novoBin
                }
            }
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function eor_imediato() {
            var valor_1 = addressMemoriaCPU(this.PC += 1)
            var novoBin = ''
            for (var x = 0; x < 8; x++){
                if (this.A[x] != valor_1[x]){
                    novoBin += '1'
                }else {
                    novoBin += '0'
                }
                if (novoBin.length == 8){
                    this.A = novoBin
                }
            }
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function eor_zeroPage() {
            // this.memoriaCPU.RAM[0xff] = '11111111'
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2))
            var novoBin = ''
            for (var x = 0; x < 8; x++){
                if (this.A[x] != valor_1[x]){
                    novoBin += '1'
                }else {
                    novoBin += '0'
                }
                if (novoBin.length == 8){
                    this.A = novoBin
                }
            }
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function eor_zeroPage_x() {
            // this.memoriaCPU.RAM[0xff] = '11111111'
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2) + parseInt(this.X, 2))
            var novoBin = ''
            for (var x = 0; x < 8; x++){
                if (this.A[x] != valor_1[x]){
                    novoBin += '1'
                }else {
                    novoBin += '0'
                }
                if (novoBin.length == 8){
                    this.A = novoBin
                }
            }
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function eor_absolute() {
            // this.memoriaCPU.PRG_ROM[0x4000] = '11111111'
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)), 2))
            this.PC += 1
            var novoBin = ''
            for (var x = 0; x < 8; x++){
                if (this.A[x] != valor_1[x]){
                    novoBin += '1'
                }else {
                    novoBin += '0'
                }
                if (novoBin.length == 8){
                    this.A = novoBin
                }
            }
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function eor_absolute_x() {
            // this.memoriaCPU.PRG_ROM[0x4000] = '11111111'
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.X, 2))
            this.PC += 1
            var novoBin = ''
            for (var x = 0; x < 8; x++){
                if (this.A[x] != valor_1[x]){
                    novoBin += '1'
                }else {
                    novoBin += '0'
                }
                if (novoBin.length == 8){
                    this.A = novoBin
                }
            }
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function eor_absolute_y() {
            // this.memoriaCPU.PRG_ROM[0x4000] = '11111111'
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.Y, 2))
            this.PC += 1
            var novoBin = ''
            for (var x = 0; x < 8; x++){
                if (this.A[x] != valor_1[x]){
                    novoBin += '1'
                }else {
                    novoBin += '0'
                }
                if (novoBin.length == 8){
                    this.A = novoBin
                }
            }
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function eor_indireto_x() {
            // this.memoriaCPU.RAM[0xfe] = '00000000'
            // this.memoriaCPU.RAM[0xff] = '11000000'
            // this.memoriaCPU.PRG_ROM[0x4000] = '11111111'
            var address_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2) + parseInt(this.X, 2))
            var address_2 = addressMemoriaCPU((parseInt(addressMemoriaCPU(this.PC), 2) + parseInt(this.X)) + 1)
            var valor_1 = addressMemoriaCPU(parseInt(address_2.concat(address_1), 2))
            var novoBin = ''
            for (var x = 0; x < 8; x++){
                if (this.A[x] != valor_1[x]){
                    novoBin += '1'
                }else {
                    novoBin += '0'
                }
                if (novoBin.length == 8){
                    this.A = novoBin
                }
            }
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function eor_indireto_y() {
            // this.memoriaCPU.RAM[0xfe] = '11111111' 
            // this.memoriaCPU.RAM[0xff] = '10111111'
            // this.memoriaCPU.PRG_ROM[0x4000] = '11111111'
            var address_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2))
            var address_2 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC), 2) + 1)
            var valor_1 = addressMemoriaCPU(parseInt(address_2.concat(address_1), 2) + parseInt(this.Y, 2))
            var novoBin = ''
            for (var x = 0; x < 8; x++){
                if (this.A[x] != valor_1[x]){
                    novoBin += '1'
                }else {
                    novoBin += '0'
                }
                if (novoBin.length == 8){
                    this.A = novoBin
                }
            }
            // alert(this.A + ' /// ' + parseInt(this.A, 2).toString(16))
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function inx_implicito() {
            var resultado = (parseInt(this.X, 2) + 1).toString(2).padStart(8, '0')
            this.X = resultado.slice((resultado.length - 8), resultado.length) // 8 bits
            if (parseInt(this.X, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.X.slice(0, 1)
        }
        function iny_implicito() {
            var resultado = (parseInt(this.Y, 2) + 1).toString(2).padStart(8, '0')
            this.Y = resultado.slice((resultado.length - 8), resultado.length) // 8 bits
            if (parseInt(this.Y, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.Y.slice(0, 1)
        }
        function dex_implicito() {
            var resultado = parseInt(this.X, 2) - 1
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0')
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            this.X = resultado.slice((resultado.length - 8), resultado.length) // 8 bits
            if (parseInt(this.X, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.X.slice(0, 1)
        }
        function dey_implicito() {
            var resultado = parseInt(this.Y, 2) - 1
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0')
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            this.Y = resultado.slice((resultado.length - 8), resultado.length) // 8 bits
            if (parseInt(this.Y, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.Y.slice(0, 1)
        }
        function inc_zeroPage() {
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2))
            var resultado = (parseInt(valor_1, 2) + 1).toString(2).padStart(8, '0')
            resultado = resultado.slice((resultado.length - 8), resultado.length) // 8 bits
            var address = parseInt(addressMemoriaCPU(this.PC), 2)
            // alert(address)
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = resultado
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = resultado
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = resultado
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = resultado
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = resultado
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = resultado
            }
            if (parseInt(addressMemoriaCPU(address), 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = addressMemoriaCPU(address).slice(0, 1) 
        }
        function inc_zeroPage_x() {
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2) + parseInt(this.X, 2))
            // alert(valor_1)
            var resultado = (parseInt(valor_1, 2) + 1).toString(2).padStart(8, '0')
            resultado = resultado.slice((resultado.length - 8), resultado.length) // 8 bits
            var address = parseInt(addressMemoriaCPU(this.PC), 2) + parseInt(this.X, 2)
            // alert(address)
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = resultado
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = resultado
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = resultado
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = resultado
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = resultado
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = resultado
            }
            if (parseInt(addressMemoriaCPU(address), 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = addressMemoriaCPU(address).slice(0, 1) 
        }
        function inc_absolute() {
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)), 2))
            this.PC += 1
            var resultado = (parseInt(valor_1, 2) + 1).toString(2).padStart(8, '0')
            resultado = resultado.slice((resultado.length - 8), resultado.length) // 8 bits
            var address = parseInt(addressMemoriaCPU(this.PC).concat(addressMemoriaCPU(this.PC -= 1)), 2)
            this.PC += 1
            // alert(address)
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = resultado
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = resultado
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = resultado
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = resultado
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = resultado
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = resultado
            }
            if (parseInt(addressMemoriaCPU(address), 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = addressMemoriaCPU(address).slice(0, 1) 
        }
        function inc_absolute_x() {
            // this.memoriaCPU.PRG_ROM[0xfa01 - 0x8000] = '01111111'
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.X, 2))
            this.PC += 1
            var resultado = (parseInt(valor_1, 2) + 1).toString(2).padStart(8, '0')
            resultado = resultado.slice((resultado.length - 8), resultado.length) // 8 bits
            var address = parseInt(addressMemoriaCPU(this.PC).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.X, 2)
            this.PC += 1
            // alert('en _ '+address+'   - valor ~ '+resultado)
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = resultado
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = resultado
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = resultado
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = resultado
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = resultado
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = resultado
            }
            if (parseInt(addressMemoriaCPU(address), 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = addressMemoriaCPU(address).slice(0, 1) 
        }
        function dec_zeroPage() {
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2))
            var resultado = valor_1 - 1
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0')
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            resultado = resultado.slice((resultado.length - 8), resultado.length) // 8 bits
            var address = parseInt(addressMemoriaCPU(this.PC), 2)
            // alert(address)
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = resultado
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = resultado
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = resultado
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = resultado
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = resultado
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = resultado
            }
            if (parseInt(addressMemoriaCPU(address), 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = addressMemoriaCPU(address).slice(0, 1)
        }
        function dec_zeroPage_x() {
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2) + parseInt(this.X, 2))
            var resultado = valor_1 - 1
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0')
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            resultado = resultado.slice((resultado.length - 8), resultado.length) // 8 bits
            var address = parseInt(addressMemoriaCPU(this.PC), 2) + parseInt(this.X, 2)
            // alert(address)
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = resultado
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = resultado
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = resultado
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = resultado
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = resultado
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = resultado
            }
            if (parseInt(addressMemoriaCPU(address), 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = addressMemoriaCPU(address).slice(0, 1)
        }
        function dec_absolute() {
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)), 2))
            this.PC += 1
            var resultado = valor_1 - 1
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0')
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            resultado = resultado.slice((resultado.length - 8), resultado.length) // 8 bits
            var address = parseInt(addressMemoriaCPU(this.PC).concat(addressMemoriaCPU(this.PC -= 1)), 2)
            this.PC += 1
            // alert(address)
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = resultado
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = resultado
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = resultado
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = resultado
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = resultado
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = resultado
            }
            if (parseInt(addressMemoriaCPU(address), 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = addressMemoriaCPU(address).slice(0, 1)
        }
        function dec_absolute_x() {
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.X, 2))
            this.PC += 1
            var resultado = valor_1 - 1
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0')
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            resultado = resultado.slice((resultado.length - 8), resultado.length) // 8 bits
            var address = parseInt(addressMemoriaCPU(this.PC).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.X, 2)
            this.PC += 1
            // alert(address)
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = resultado
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = resultado
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = resultado
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = resultado
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = resultado
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = resultado
            }
            if (parseInt(addressMemoriaCPU(address), 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = addressMemoriaCPU(address).slice(0, 1)
        }
        function cmp_imediato() {
            // cmp funciona usando subtracao sem carry sinalizador C
            var valor_1 = addressMemoriaCPU(this.PC += 1)
            var resultado = parseInt(this.A, 2) - parseInt(valor_1, 2)
            // alert(resultado)
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0') // tirar negativo
                // alert(resultado)
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            if (parseInt(this.A, 2) < parseInt(valor_1, 2)){ 
                this.flags.C = 0
            }else if(parseInt(this.A, 2) == parseInt(valor_1, 2)){
                this.flags.C = 1
            }else if(parseInt(this.A, 2) > parseInt(valor_1, 2)){
                this.flags.C = 1
            }
            resultado = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            // alert(resultado)
            if (parseInt(this.A, 2) == parseInt(valor_1, 2)){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = resultado.slice(0, 1)
        }
        function cmp_zeroPage() {
            // cmp funciona usando subtracao sem carry sinalizador C
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2))
            var resultado = parseInt(this.A, 2) - parseInt(valor_1, 2)
            // alert(resultado)
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0') // tirar negativo
                // alert(resultado)
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            if (parseInt(this.A, 2) < parseInt(valor_1, 2)){ 
                this.flags.C = 0
            }else if(parseInt(this.A, 2) == parseInt(valor_1, 2)){
                this.flags.C = 1
            }else if(parseInt(this.A, 2) > parseInt(valor_1, 2)){
                this.flags.C = 1
            }
            resultado = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            // alert(resultado)
            if (parseInt(this.A, 2) == parseInt(valor_1, 2)){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = resultado.slice(0, 1)
        }
        function cmp_zeroPage_x() {
            // cmp funciona usando subtracao sem carry sinalizador C
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2) + parseInt(this.X, 2))
            var resultado = parseInt(this.A, 2) - parseInt(valor_1, 2)
            // alert(resultado)
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0') // tirar negativo
                // alert(resultado)
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            if (parseInt(this.A, 2) < parseInt(valor_1, 2)){ 
                this.flags.C = 0
            }else if(parseInt(this.A, 2) == parseInt(valor_1, 2)){
                this.flags.C = 1
            }else if(parseInt(this.A, 2) > parseInt(valor_1, 2)){
                this.flags.C = 1
            }
            resultado = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            // alert(resultado)
            if (parseInt(this.A, 2) == parseInt(valor_1, 2)){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = resultado.slice(0, 1)
        }
        function cmp_absolute() {
            // cmp funciona usando subtracao sem carry sinalizador C
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)), 2))
            this.PC += 1
            var resultado = parseInt(this.A, 2) - parseInt(valor_1, 2)
            // alert(resultado)
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0') // tirar negativo
                // alert(resultado)
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            if (parseInt(this.A, 2) < parseInt(valor_1, 2)){ 
                this.flags.C = 0
            }else if(parseInt(this.A, 2) == parseInt(valor_1, 2)){
                this.flags.C = 1
            }else if(parseInt(this.A, 2) > parseInt(valor_1, 2)){
                this.flags.C = 1
            }
            resultado = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            alert(resultado)
            if (parseInt(this.A, 2) == parseInt(valor_1, 2)){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = resultado.slice(0, 1)
        }
        function cmp_absolute_x() {
            // cmp funciona usando subtracao sem carry sinalizador C
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.X, 2))
            this.PC += 1
            var resultado = parseInt(this.A, 2) - parseInt(valor_1, 2)
            // alert(resultado)
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0') // tirar negativo
                // alert(resultado)
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            if (parseInt(this.A, 2) < parseInt(valor_1, 2)){ 
                this.flags.C = 0
            }else if(parseInt(this.A, 2) == parseInt(valor_1, 2)){
                this.flags.C = 1
            }else if(parseInt(this.A, 2) > parseInt(valor_1, 2)){
                this.flags.C = 1
            }
            resultado = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            // alert(resultado)
            if (parseInt(this.A, 2) == parseInt(valor_1, 2)){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = resultado.slice(0, 1)
        }
        function cmp_absolute_y() {
            // cmp funciona usando subtracao sem carry sinalizador C
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.Y, 2))
            this.PC += 1
            var resultado = parseInt(this.A, 2) - parseInt(valor_1, 2)
            // alert(resultado)
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0') // tirar negativo
                // alert(resultado)
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            if (parseInt(this.A, 2) < parseInt(valor_1, 2)){ 
                this.flags.C = 0
            }else if(parseInt(this.A, 2) == parseInt(valor_1, 2)){
                this.flags.C = 1
            }else if(parseInt(this.A, 2) > parseInt(valor_1, 2)){
                this.flags.C = 1
            }
            resultado = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            // alert(resultado)
            if (parseInt(this.A, 2) == parseInt(valor_1, 2)){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = resultado.slice(0, 1)
        }
        function cmp_indireto_x() {
            // cmp funciona usando subtracao sem carry sinalizador C
            //this.memoriaCPU.RAM[0xfe] = '00000000'
            //this.memoriaCPU.RAM[0xff] = '11000000'
            var address_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2) + parseInt(this.X, 2))
            var address_2 = addressMemoriaCPU((parseInt(addressMemoriaCPU(this.PC), 2) + parseInt(this.X)) + 1)
            var valor_1 = addressMemoriaCPU(parseInt(address_2.concat(address_1), 2))
            var resultado = parseInt(this.A, 2) - parseInt(valor_1, 2)
            // alert(resultado)
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0') // tirar negativo
                // alert(resultado)
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            if (parseInt(this.A, 2) < parseInt(valor_1, 2)){ 
                this.flags.C = 0
            }else if(parseInt(this.A, 2) == parseInt(valor_1, 2)){
                this.flags.C = 1
            }else if(parseInt(this.A, 2) > parseInt(valor_1, 2)){
                this.flags.C = 1
            }
            resultado = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            //alert(resultado)
            if (parseInt(this.A, 2) == parseInt(valor_1, 2)){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = resultado.slice(0, 1)
        }
        function cmp_indireto_y() {
            // cmp funciona usando subtracao sem carry sinalizador C
            this.memoriaCPU.RAM[0xfe] = '11111111' 
            this.memoriaCPU.RAM[0xff] = '10111111'
            var address_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2))
            var address_2 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC), 2) + 1)
            var valor_1 = addressMemoriaCPU(parseInt(address_2.concat(address_1), 2) + parseInt(this.Y, 2))
            var resultado = parseInt(this.A, 2) - parseInt(valor_1, 2)
            // alert(resultado)
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0') // tirar negativo
                // alert(resultado)
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            if (parseInt(this.A, 2) < parseInt(valor_1, 2)){ 
                this.flags.C = 0
            }else if(parseInt(this.A, 2) == parseInt(valor_1, 2)){
                this.flags.C = 1
            }else if(parseInt(this.A, 2) > parseInt(valor_1, 2)){
                this.flags.C = 1
            }
            resultado = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            alert(resultado)
            if (parseInt(this.A, 2) == parseInt(valor_1, 2)){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = resultado.slice(0, 1)
        }
        function cpx_imediato() {
            // cpx funciona usando subtracao sem carry sinalizador C
            var valor_1 = addressMemoriaCPU(this.PC += 1)
            var resultado = parseInt(this.X, 2) - parseInt(valor_1, 2)
            // alert(resultado)
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0') // tirar negativo
                // alert(resultado)
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            if (parseInt(this.X, 2) < parseInt(valor_1, 2)){ 
                this.flags.C = 0
            }else if(parseInt(this.X, 2) == parseInt(valor_1, 2)){
                this.flags.C = 1
            }else if(parseInt(this.X, 2) > parseInt(valor_1, 2)){
                this.flags.C = 1
            }
            resultado = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            // alert(resultado)
            if (parseInt(this.X, 2) == parseInt(valor_1, 2)){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = resultado.slice(0, 1)
        }
        function cpx_zeroPage() {
            // cpx funciona usando subtracao sem carry sinalizador C
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2))
            var resultado = parseInt(this.X, 2) - parseInt(valor_1, 2)
            // alert(resultado)
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0') // tirar negativo
                // alert(resultado)
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            if (parseInt(this.X, 2) < parseInt(valor_1, 2)){ 
                this.flags.C = 0
            }else if(parseInt(this.X, 2) == parseInt(valor_1, 2)){
                this.flags.C = 1
            }else if(parseInt(this.X, 2) > parseInt(valor_1, 2)){
                this.flags.C = 1
            }
            resultado = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            // alert(resultado)
            if (parseInt(this.X, 2) == parseInt(valor_1, 2)){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = resultado.slice(0, 1)
        }
        function cpx_absolute() {
            // cpx funciona usando subtracao sem carry sinalizador C
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)), 2))
            this.PC += 1
            var resultado = parseInt(this.X, 2) - parseInt(valor_1, 2)
            // alert(resultado)
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0') // tirar negativo
                // alert(resultado)
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            if (parseInt(this.X, 2) < parseInt(valor_1, 2)){ 
                this.flags.C = 0
            }else if(parseInt(this.X, 2) == parseInt(valor_1, 2)){
                this.flags.C = 1
            }else if(parseInt(this.X, 2) > parseInt(valor_1, 2)){
                this.flags.C = 1
            }
            resultado = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            alert(resultado)
            if (parseInt(this.X, 2) == parseInt(valor_1, 2)){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = resultado.slice(0, 1)
        }
        // --------------------------------------------------------------
        function cpy_imediato() {
            // cpx funciona usando subtracao sem carry sinalizador C
            var valor_1 = addressMemoriaCPU(this.PC += 1)
            var resultado = parseInt(this.Y, 2) - parseInt(valor_1, 2)
            // alert(resultado)
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0') // tirar negativo
                // alert(resultado)
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            if (parseInt(this.Y, 2) < parseInt(valor_1, 2)){ 
                this.flags.C = 0
            }else if(parseInt(this.Y, 2) == parseInt(valor_1, 2)){
                this.flags.C = 1
            }else if(parseInt(this.Y, 2) > parseInt(valor_1, 2)){
                this.flags.C = 1
            }
            resultado = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            // alert(resultado)
            if (parseInt(this.Y, 2) == parseInt(valor_1, 2)){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = resultado.slice(0, 1)
        }
        function cpy_zeroPage() {
            // cpx funciona usando subtracao sem carry sinalizador C
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2))
            var resultado = parseInt(this.Y, 2) - parseInt(valor_1, 2)
            // alert(resultado)
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0') // tirar negativo
                // alert(resultado)
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            if (parseInt(this.Y, 2) < parseInt(valor_1, 2)){ 
                this.flags.C = 0
            }else if(parseInt(this.Y, 2) == parseInt(valor_1, 2)){
                this.flags.C = 1
            }else if(parseInt(this.Y, 2) > parseInt(valor_1, 2)){
                this.flags.C = 1
            }
            resultado = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            // alert(resultado)
            if (parseInt(this.Y, 2) == parseInt(valor_1, 2)){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = resultado.slice(0, 1)
        }
        function cpy_absolute() {
            // cpx funciona usando subtracao sem carry sinalizador C
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)), 2))
            this.PC += 1
            var resultado = parseInt(this.Y, 2) - parseInt(valor_1, 2)
            // alert(resultado)
            if (resultado < 0){
                resultado = (256 - (resultado * -1)).toString(2).padStart(8, '0') // tirar negativo
                // alert(resultado)
            }else {
                resultado = (resultado).toString(2).padStart(8, '0')
            }
            if (parseInt(this.Y, 2) < parseInt(valor_1, 2)){ 
                this.flags.C = 0
            }else if(parseInt(this.Y, 2) == parseInt(valor_1, 2)){
                this.flags.C = 1
            }else if(parseInt(this.Y, 2) > parseInt(valor_1, 2)){
                this.flags.C = 1
            }
            resultado = resultado.slice((resultado.length - 8), resultado.length) //8 bits
            alert(resultado)
            if (parseInt(this.Y, 2) == parseInt(valor_1, 2)){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = resultado.slice(0, 1)
        }
        function bit_zeroPage() {
            // bit funciona usando instrucao AND
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2))
            var novoBin = ''
            for (var x = 0; x < 8; x++){
                if (this.A[x] == 1 & valor_1[x] == 1){
                    novoBin += '1'
                }else {
                    novoBin += '0'
                }
            }
            if (parseInt(novoBin, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.V = valor_1.slice(1, 2) // iqual bit 6
            this.flags.N = valor_1.slice(0, 1) // iqual bit 7
        }
        function bit_absolute() {
            // bit funciona usando instrucao AND
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)), 2))
            this.PC += 1
            var novoBin = ''
            for (var x = 0; x < 8; x++){
                if (this.A[x] == 1 & valor_1[x] == 1){
                    novoBin += '1'
                }else {
                    novoBin += '0'
                }
            }
            if (parseInt(novoBin, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.V = valor_1.slice(1, 2) // iqual bit 6
            this.flags.N = valor_1.slice(0, 1) // iqual bit 7
        }
        function lsr_acumulador() {
            this.flags.C = this.A.slice(7, 8)
            var valor_1 = `0${this.A.slice(0, 7)}`
            this.A = valor_1
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = '0' // empre apagado (porque o bit #7 se torna zero)
        }
        function lsr_zeroPage() {
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2))
            this.flags.C = valor_1.slice(7, 8)
            var resultado = `0${valor_1.slice(0, 7)}`
            var address = parseInt(addressMemoriaCPU(this.PC), 2)
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = resultado
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = resultado
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = resultado
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = resultado
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = resultado
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = resultado
            }
            if (parseInt(resultado, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = '0' // empre apagado (porque o bit #7 se torna zero)
        }
        function lsr_zeroPage_x() {
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2) + parseInt(this.X, 2))
            this.flags.C = valor_1.slice(7, 8)
            var resultado = `0${valor_1.slice(0, 7)}`
            var address = parseInt(addressMemoriaCPU(this.PC), 2) + parseInt(this.X, 2)
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = resultado
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = resultado
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = resultado
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = resultado
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = resultado
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = resultado
            }
            if (parseInt(resultado, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = '0' // empre apagado (porque o bit #7 se torna zero)
        }
        function lsr_absolute() {
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)), 2))
            this.PC += 1
            this.flags.C = valor_1.slice(7, 8)
            var resultado = `0${valor_1.slice(0, 7)}`
            var address = parseInt(addressMemoriaCPU(this.PC).concat(addressMemoriaCPU(this.PC -= 1)), 2)
            this.PC += 1
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = resultado
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = resultado
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = resultado
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = resultado
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = resultado
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = resultado
            }
            if (parseInt(resultado, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = '0' // empre apagado (porque o bit #7 se torna zero) 
        }
        function lsr_absolute_x() {
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.X, 2))
            this.PC += 1
            this.flags.C = valor_1.slice(7, 8)
            var resultado = `0${valor_1.slice(0, 7)}`
            var address = parseInt(addressMemoriaCPU(this.PC).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.X, 2)
            this.PC += 1
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = resultado
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = resultado
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = resultado
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = resultado
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = resultado
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = resultado
            }
            if (parseInt(resultado, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = '0' // empre apagado (porque o bit #7 se torna zero)
        }
        function asl_acumulador() {
            this.flags.C = this.A.slice(0, 1)
            var valor_1 = `${this.A.slice(1, 8)}0`
            this.A = valor_1
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function asl_zeroPage() {
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2))
            this.flags.C = this.A.slice(0, 1)
            var resultado = `${this.A.slice(1, 8)}0`
            var address = parseInt(addressMemoriaCPU(this.PC), 2)
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = resultado
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = resultado
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = resultado
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = resultado
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = resultado
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = resultado
            }
            if (parseInt(resultado, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = resultado.slice(0, 1)
        }
        function asl_zeroPage_x() {
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2) + parseInt(this.X, 2))
            this.flags.C = this.A.slice(0, 1)
            var resultado = `${this.A.slice(1, 8)}0`
            var address = parseInt(addressMemoriaCPU(this.PC), 2) + parseInt(this.X, 2)
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = resultado
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = resultado
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = resultado
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = resultado
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = resultado
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = resultado
            }
            if (parseInt(resultado, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = resultado.slice(0, 1)
        }
        function asl_absolute() {
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)), 2))
            this.PC += 1
            this.flags.C = this.A.slice(0, 1)
            var resultado = `${this.A.slice(1, 8)}0`
            var address = parseInt(addressMemoriaCPU(this.PC).concat(addressMemoriaCPU(this.PC -= 1)), 2)
            this.PC += 1
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = resultado
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = resultado
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = resultado
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = resultado
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = resultado
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = resultado
            }
            if (parseInt(resultado, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = resultado.slice(0, 1)
        }
        function asl_absolute_x() {
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.X, 2))
            this.PC += 1
            this.flags.C = this.A.slice(0, 1)
            var resultado = `${this.A.slice(1, 8)}0`
            var address = parseInt(addressMemoriaCPU(this.PC).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.X, 2)
            this.PC += 1
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = resultado
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = resultado
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = resultado
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = resultado
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = resultado
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = resultado
            }
            if (parseInt(resultado, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = resultado.slice(0, 1)
        }
        function rol_acumulador() {
            var valor_1 = (this.A.slice(1, 8)).concat(this.flags.C)
            this.flags.C = this.A.slice(0, 1)
            this.A = valor_1
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = this.A.slice(0, 1)
        }
        function rol_zeroPage() {
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2))
            var resultado = (valor_1.slice(1, 8)).concat(this.flags.C)
            this.flags.C = valor_1.slice(0, 1)
            var address = parseInt(addressMemoriaCPU(this.PC), 2)
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = resultado
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = resultado
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = resultado
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = resultado
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = resultado
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = resultado
            }
            if (parseInt(resultado, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = resultado.slice(0, 1)
        }
        function rol_zeroPage_x() {
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2) + parseInt(this.X, 2))
            var resultado = (valor_1.slice(1, 8)).concat(this.flags.C)
            this.flags.C = valor_1.slice(0, 1)
            var address = parseInt(addressMemoriaCPU(this.PC), 2) + parseInt(this.X, 2)
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = resultado
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = resultado
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = resultado
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = resultado
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = resultado
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = resultado
            }
            if (parseInt(resultado, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = resultado.slice(0, 1)
        }
        function rol_absolute() {
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)), 2))
            this.PC += 1
            var resultado = (valor_1.slice(1, 8)).concat(this.flags.C)
            this.flags.C = valor_1.slice(0, 1)
            var address = parseInt(addressMemoriaCPU(this.PC).concat(addressMemoriaCPU(this.PC -= 1)), 2)
            this.PC += 1
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = resultado
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = resultado
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = resultado
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = resultado
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = resultado
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = resultado
            }
            if (parseInt(resultado, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = resultado.slice(0, 1)
        }
        function rol_absolute_x() {
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.X, 2))
            this.PC += 1
            var resultado = (valor_1.slice(1, 8)).concat(this.flags.C)
            this.flags.C = valor_1.slice(0, 1)
            var address = parseInt(addressMemoriaCPU(this.PC).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.X, 2)
            this.PC += 1
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = resultado
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = resultado
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = resultado
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = resultado
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = resultado
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = resultado
            }
            if (parseInt(resultado, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
            this.flags.N = resultado.slice(0, 1)
        }
        function ror_acumulador() {
            var valor_1 = `${this.flags.C}${this.A.slice(0, 7)}`
            this.flags.N = this.flags.C // N definedo como o valor anterior da flag C
            this.flags.C = this.A.slice(7, 8)
            this.A = valor_1
            if (parseInt(this.A, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
        }
        function ror_zeroPage() {
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2))
            var resultado = `${this.flags.C}${valor_1.slice(0, 7)}`
            this.flags.N = this.flags.C // N definedo como o valor anterior da flag C
            this.flags.C = valor_1.slice(7, 8)
            var address = parseInt(addressMemoriaCPU(this.PC), 2)
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = resultado
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = resultado
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = resultado
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = resultado
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = resultado
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = resultado
            }
            if (parseInt(resultado, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
        }
        function ror_zeroPage_x() {
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 1), 2) + parseInt(this.X, 2))
            var resultado = `${this.flags.C}${valor_1.slice(0, 7)}`
            this.flags.N = this.flags.C // N definedo como o valor anterior da flag C
            this.flags.C = valor_1.slice(7, 8)
            var address = parseInt(addressMemoriaCPU(this.PC), 2) + parseInt(this.X, 2)
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = resultado
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = resultado
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = resultado
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = resultado
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = resultado
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = resultado
            }
            if (parseInt(resultado, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
        }
        function ror_absolute() {
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)), 2))
            this.PC += 1
            var resultado = `${this.flags.C}${valor_1.slice(0, 7)}`
            this.flags.N = this.flags.C // N definedo como o valor anterior da flag C
            this.flags.C = valor_1.slice(7, 8)
            var address = parseInt(addressMemoriaCPU(this.PC).concat(addressMemoriaCPU(this.PC -= 1)), 2)
            this.PC += 1
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = resultado
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = resultado
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = resultado
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = resultado
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = resultado
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = resultado
            }
            if (parseInt(resultado, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
        }
        function ror_absolute_x() {
            var valor_1 = addressMemoriaCPU(parseInt(addressMemoriaCPU(this.PC += 2).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.X, 2))
            this.PC += 1
            var resultado = `${this.flags.C}${valor_1.slice(0, 7)}`
            this.flags.N = this.flags.C // N definedo como o valor anterior da flag C
            this.flags.C = valor_1.slice(7, 8)
            var address = parseInt(addressMemoriaCPU(this.PC).concat(addressMemoriaCPU(this.PC -= 1)) ,2) + parseInt(this.X, 2)
            this.PC += 1
            if (address < 0x2000){
                this.memoriaCPU.RAM[address] = resultado
            }else if(address < 0x4000){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4014){
                this.memoriaCPU.PPU[address - 0x2000] = resultado
            }else if(address == 0x4015){
                this.memoriaCPU.APU[address - 0x4015] = resultado
            }else if(address == 0x4016){
                this.memoriaCPU.CONTROLLER_1[address - 0x4016] = resultado
            }else if(address == 0x4017){
                this.memoriaCPU.CONTROLLER_2[address - 0x4016] = resultado
            }else if(address >= 0x6000 & address < 0x8000){
                this.memoriaCPU.SRAM[address - 0x6000] = resultado
            } else if (address >= 0x8000){
                this.memoriaCPU.PRG_ROM[address - 0x8000] = resultado
            }
            if (parseInt(resultado, 2) == 0){
                this.flags.Z = 1
            }else {
                this.flags.Z = 0
            }
        }
    </script>
</body>
</html>
