var textNovo = window.document.getElementById('text');
window.onload = function cpu(){
	this.memoria = {
		ram: [],
		ppu: [],
		apu: [],
		comtroller1: [],
		comtroller2: [],
		mapper: [],
		rom: []
	};
	
	this.PC = 0x0000;
	this.SP = 0x00;
	this.Cycles = 0;
	
	this.A = 0x0000;
	this.X = 0x0000;
	this.Y = 0x0000;
	
	this.C = 0;
	this.I = 0;
	this.Z = 0;
	this.D = 0;
	this.B = 0;
	this.V = 0;
	this.N = 0;
	this.frequencia = // 0,001;
	cartucho();
};
function mapaMenoria(localMemoria){
	if (localMemoria < 0x2000){
		return memoria.ram[localMemoria];
	}else if (localMemoria < 0x4000){
		return memoria.ppu[localMemoria - 0x2000];
	}else if (localMemoria == 0x4014){
		return memoria.ppu[localMemoria - 0x4014];
	}else if (localMemoria == 0x4015){
		return memoria.apu[localMemoria - 0x4015];
	}else if (localMemoria == 0x4016){
		return memoria.comtroller1[localMemoria - 0x4016];
	}else if (localMemoria == 0x4017){
		return memoria.comtroller2[localMemoria - 0x4017];
	}else if (localMemoria < 0x6000){
		// toda memoria I / O
	}else if (localMemoria < 0x8000){
		return memoria.mapper[localMemoria - 0x6000];
	}else if (localMemoria < 0xffff){
		return memoria.rom[localMemoria - 0x8000];
	}
}
function cartucho(){
	this.m = {
		CHR_RAM: [],
		CHR_ROM: [],
		PRG_RAM: [],
		PRG_ROM: [],
	};
	carragarBytes();
}
function carragarBytes(){
	var bytes = window.document.getElementById('codigoBin');
	var run = window.document.getElementById('runBin');
	bytes = bytes.value.split(" ").join("");
	run.addEventListener('click', function(){
		var _8bit = 0;
		for (var x = 0; x < (bytes.length - 1) / 8; x ++){
			m.PRG_ROM[x] = bytes.slice(_8bit, _8bit += 8);
			if (x == (bytes.length / 8) - 1){
				Identification();
			}
		}
	});
}
function Identification(){
	var iNESFormat = false;
	var NES20Format = false;
	if (m.PRG_ROM[0] == '01001110' & m.PRG_ROM[1] == '01000101' & m.PRG_ROM[2] == '01010011' & m.PRG_ROM[3] == '00011010'){
		iNESFormat = true;
		if (iNESFormat == true & (m.PRG_ROM[7] & '00001100') == '00001000'){
			NES20Format = true;
		}
	}
	if (iNESFormat & NES20Format != true){
		headerINESFormat_mapper();
	}else if(iNESFormat & NES20Format){
		headerNES20Format_mapper();
	}else{
		window.alert('Erro Formato Incompativel');
	}
}
function headerINESFormat_mapper(){
	var NibuloInferior = m.PRG_ROM[6].slice(0, 4);
	var NibuloSuperior = m.PRG_ROM[7].slice(0, 4);
	this.ID = parseInt(NibuloSuperior + NibuloInferior, 2);
	mapeadores(ID);
	reset();
}
function headerNES20Format_mapper(){
	window.alert('NES 2.0 Format Incompativel');
}
function mapeadores(ID){
	switch(ID){
		case 0:
			mapper_000();
		break;
		case 2:
			mapper_002();
		break;
		default:
			window.alert('Mapper Incompativel');
		break;
	}
}
function mapper_000(){
	this.tamanhoBanco_PRG_ROM = parseInt(m.PRG_ROM[4], 2);
	this.tamanhoBanco_CHR_ROM = parseInt(m.PRG_ROM[5], 2);
	this.espelhamentoNomenclatura = m.PRG_ROM[6].slice(7, 8); // if 0 = H else V
	this.bancoPRG_ROM = [];
	if (tamanhoBanco_PRG_ROM == 0x01){				// NROM-128
		bancoPRG_ROM[0] = m.PRG_ROM.slice(0x0000, 0x4000);
		bancoPRG_ROM[1] = m.PRG_ROM.slice(0x0000, 0x4000);
	}else if (tamanhoBanco_PRG_ROM == 0x02){		// NROM-256
		bancoPRG_ROM[0] = m.PRG_ROM.slice(0x0000, 0x4000);
		bancoPRG_ROM[1] = m.PRG_ROM.slice(0x4000, 0x8000);
	}
	memoria.rom = bancoPRG_ROM[1].concat(bancoPRG_ROM[0]);
}
function NROM(address){
	if (address < 0x2000){
		m.CHR_ROM = memoria.ram;
	}
}
function mapper_002(){
	this.tamanhoBanco_PRG_ROM = parseInt(m.PRG_ROM[4], 2);
	this.tamanhoBanco_CHR_ROM = parseInt(m.PRG_ROM[5], 2);
	this.espelhamentoNomenclatura = m.PRG_ROM[6].slice(7, 8); // if 0 = H else V
	this.bancoPRG_ROM = [];
	if (tamanhoBanco_PRG_ROM == 0x04){				// UNROM
		bancoPRG_ROM[0] = m.PRG_ROM.slice(0x0000, 0x4000);
		bancoPRG_ROM[1] = m.PRG_ROM.slice(0x4000, 0x8000);
		bancoPRG_ROM[2] = m.PRG_ROM.slice(0x8000, 0xC000);
		bancoPRG_ROM[3] = m.PRG_ROM.slice(0xC000, 0xFFFF);
	}else if (tamanhoBanco_PRG_ROM == 0x08){		// UNROM
		bancoPRG_ROM[0] = m.PRG_ROM.slice(0x0000, 0x4000);
		bancoPRG_ROM[1] = m.PRG_ROM.slice(0x4000, 0x8000);
		bancoPRG_ROM[2] = m.PRG_ROM.slice(0x8000, 0xC000);
		bancoPRG_ROM[3] = m.PRG_ROM.slice(0xC000, 0xFFFF);
		bancoPRG_ROM[4] = m.PRG_ROM.slice(0xFFFF, 0x13FFF);
		bancoPRG_ROM[5] = m.PRG_ROM.slice(0x13FFF, 0x17FFF);
		bancoPRG_ROM[6] = m.PRG_ROM.slice(0x17FFF, 0x1BFFF);
		bancoPRG_ROM[7] = m.PRG_ROM.slice(0x1BFFF, 0x1FFFF);
	}else if (tamanhoBanco_PRG_ROM == 0x10){		// UOROM   
		bancoPRG_ROM[0] = m.PRG_ROM.slice(0x0000, 0x4000);
		bancoPRG_ROM[1] = m.PRG_ROM.slice(0x4000, 0x8000);
		bancoPRG_ROM[2] = m.PRG_ROM.slice(0x8000, 0xC000);
		bancoPRG_ROM[3] = m.PRG_ROM.slice(0xC000, 0xFFFF);
		bancoPRG_ROM[4] = m.PRG_ROM.slice(0xFFFF, 0x13FFF);
		bancoPRG_ROM[5] = m.PRG_ROM.slice(0x13FFF, 0x17FFF);
		bancoPRG_ROM[6] = m.PRG_ROM.slice(0x17FFF, 0x1BFFF);
		bancoPRG_ROM[7] = m.PRG_ROM.slice(0x1BFFF, 0x1FFFF);
		bancoPRG_ROM[8] = m.PRG_ROM.slice(0x1FFFF, 0x23FFF);
		bancoPRG_ROM[9] = m.PRG_ROM.slice(0x23FFF, 0x27FFF);
		bancoPRG_ROM[10] = m.PRG_ROM.slice(0x27FFF, 0x2BFFF);
		bancoPRG_ROM[11] = m.PRG_ROM.slice(0x2BFFF, 0x2FFFF);
		bancoPRG_ROM[12] = m.PRG_ROM.slice(0x2FFFF, 0x212991);
		bancoPRG_ROM[13] = m.PRG_ROM.slice(0x212991, 0x37FFF);
		bancoPRG_ROM[14] = m.PRG_ROM.slice(0x37FFF, 0x3BFFF);
		bancoPRG_ROM[15] = m.PRG_ROM.slice(0x3BFFF, 0x3FFFF);
	}
	switch(tamanhoBanco_PRG_ROM){
		case 0x04:
			memoria.rom = bancoPRG_ROM[0].concat(bancoPRG_ROM[3]);
		break;
		case 0x08:
			memoria.rom = bancoPRG_ROM[0].concat(bancoPRG_ROM[7]);
		break;
		case 0x10:
			memoria.rom = bancoPRG_ROM[0].concat(bancoPRG_ROM[15]);
		break;
	}
}
function UxROM(address, Bankswitch){
	if (address < 0x2000){
		m.CHR_RAM = memoria.ram;
	}else if (address >= 0x8000 & address <= 0xBFFF){
   	    switch(tamanhoBanco_PRG_ROM){
			case 0x04:
				memoria.rom = bancoPRG_ROM[Bankswitch].concat(bancoPRG_ROM[3]);
			break;
			case 0x08:
				memoria.rom = bancoPRG_ROM[Bankswitch].concat(bancoPRG_ROM[7]);
			break;
			case 0x10:
				memoria.rom = bancoPRG_ROM[Bankswitch].concat(bancoPRG_ROM[15]);
			break;
		}
	}else if (address >= 0xC000 & address <= 0xFFFF){
		switch(tamanhoBanco_PRG_ROM){
			case 0x04:
				memoria.rom = bancoPRG_ROM[Bankswitch].concat(bancoPRG_ROM[3]);
			break;
			case 0x08:
				memoria.rom = bancoPRG_ROM[Bankswitch].concat(bancoPRG_ROM[7]);
			break;
			case 0x10:
				memoria.rom = bancoPRG_ROM[Bankswitch].concat(bancoPRG_ROM[15]);
			break;
		}
	}else if (address >= 0x6000 & address <= 0x7FFF){
		memoria.mapper = m.PRG_RAM;
	}
}
function reset(){
	memoria.rom[0xfffc - 0x8000] = '00000000';
	memoria.rom[0xfffd - 0x8000] = '10000000';
	A, X, Y, C, I, Z, D, B, V, N = 0;
	PC = 0xFFFC;
	SP = parseInt(0x01FD, 2);
	PC = parseInt(littleEndian(mapaMenoria(PC) + mapaMenoria(PC + 1), false), 2) + 16;
	clock();
}
function littleEndian(argumento, reverse){
	if (!reverse){
		return argumento = argumento.slice(8, 16) + argumento.slice(0, 8); // littleEndian
	}else{
		return argumento = argumento.slice(0, 8) + argumento.slice(8, 16); // bigEndian
	}
}
function clock(){
	setTimeout(function(){
		try {
			textNovo.innerHTML = ('Cycles '+Cycles + ' Endereco $ ' + (PC >>> 0).toString(16) + ' Opcode - ' + (parseInt(mapaMenoria(PC), 2) >>> 0).toString(16)+' ~ ');
			Cycles = opcode[(parseInt(mapaMenoria(PC), 2) >>> 0).toString(16)]();
		}catch(Error){}
		PC ++;
		clock();
	}, frequencia * Cycles);
}
function registradorStatus(referencia, ho, lo){
	if (parseInt(referencia, 2) > 255){
		C = 1; // Carry
	}
	if (parseInt(referencia, 2) == 0){
		Z = 1; // Zero
	}
	if (referencia.slice(0, 1) == 1){
		N = 1; // Negativo
	}
	if (C != N & ho.slice(0, 1) == lo.slice(0, 1)){
		V = 1; // Overflow
	}
	if (false){
		I = 1; // IRQ disable
	}
	if (false){
		B = 1; // BRK command
	}
	if (false){
		D = 1; // Decimal mode
	}
}
var cycles = [
	2, 3, 4, 4, 4, 4, 6, 5
];
var opcode = {
	'69': ADC_immediat, '65': ADC_zeropage, '75': ADC_zeropage_x, '6d': ADC_absoluto, '7d': ADC_absoluto_x, '79': ADC_absoluto_y, '61': ADC_indireto_x, '71': ADC_indireto_y // ✓
};
function ADC_immediat(){
	registradorStatus(A + mapaMenoria(PC + 1), A, mapaMenoria(PC + 1));
	A = (parseInt(A, 2) + parseInt(mapaMenoria(PC + 1), 2) >>> 0).toString(2);
	return cycles[0x00];
}
function ADC_zeropage(){
	var address = mapaMenoria(PC + 2);
	var valor = mapaMenoria(parseInt(address, 2));
	registradorStatus((parseInt(valor, 2) + parseInt(A, 2) >>> 0).toString(2), A, valor);
	A = (parseInt(valor, 2) + parseInt(A, 2) >>> 0).toString(2);
	return cycles[0x01];
}
function ADC_zeropage_x(){
	var address = '00000000' + (parseInt(mapaMenoria(PC + 1), 2) + parseInt(X, 2) >>> 0).toString(2);
	var valor = mapaMenoria(parseInt(address.slice(8, 16), 2));
	registradorStatus((parseInt(valor, 2) + parseInt(A, 2) >>> 0).toString(2), A, valor);
	A = (parseInt(valor, 2) + parseInt(A, 2) >>> 0).toString(2);
	return cycles[0x02];
}
function ADC_absoluto(){
	var address = littleEndian(mapaMenoria(PC + 1) + mapaMenoria(PC + 2));
	var valor = mapaMenoria(parseInt(address, 2));
	registradorStatus((parseInt(valor, 2) + parseInt(A, 2) >>> 0).toString(2), A, valor);
	A = (parseInt(valor, 2) + parseInt(A, 2) >>> 0).toString(2);
	return cycles[0x03];
}
function ADC_absoluto_x(){
	var address = (parseInt(mapaMenoria(PC + 1), 2) + parseInt(X, 2) >>> 0).toString(2);
	var valor = mapaMenoria(parseInt(address, 2));
	registradorStatus((parseInt(valor, 2) + parseInt(A, 2) >>> 0).toString(2), A, valor);
	A = (parseInt(valor, 2) + parseInt(A, 2) >>> 0).toString(2);
	return cycles[0x04];
}
function ADC_absoluto_y(){
	var address = (parseInt(mapaMenoria(PC + 1), 2) + parseInt(Y, 2) >>> 0).toString(2);
	var valor = mapaMenoria(parseInt(address, 2));
	registradorStatus((parseInt(valor, 2) + parseInt(A, 2) >>> 0).toString(2), A, valor);
	A = (parseInt(valor, 2) + parseInt(A, 2) >>> 0).toString(2);
	return cycles[0x05];
}
function ADC_indireto_x(){
	var address_1 = (parseInt(mapaMenoria(PC + 1), 2) + parseInt(X, 2) >>> 0).toString(2);
	var address_2 = littleEndian(mapaMenoria(parseInt(address_1, 2)) + mapaMenoria(parseInt(address_1, 2) + 1), false);
	var valor = mapaMenoria(parseInt(address_2, 2));
	registradorStatus((parseInt(valor, 2) + parseInt(A, 2) >>> 0).toString(2), A, valor);
	A = (parseInt(valor, 2) + parseInt(A, 2) >>> 0).toString(2);
	return cycles[0x06];
}
function ADC_indireto_y(){
	A = '11111111'; // valor 255
	Y = '00110111'; // valor 56
	memoria.ram[200] = '11111110'; // valor 254
	memoria.ram[201] = '00000110'; // valor 6
	memoria.ram[1845] = '01101111'; // valor 111
	// 255 + 111 = 366
	
	var address_1 = mapaMenoria(PC + 1);
	var address_2 = littleEndian(mapaMenoria(parseInt(address_1, 2)) + mapaMenoria(parseInt(address_1, 2) + 1), false);
	var valor = mapaMenoria(parseInt(address_2, 2) + parseInt(Y, 2));
	registradorStatus((parseInt(valor, 2) + parseInt(A, 2) >>> 0).toString(2), A, valor);
	A = (parseInt(valor, 2) + parseInt(A, 2) >>> 0).toString(2);
	window.alert(parseInt(A, 2) + ' ~ C ' + C + ' N ' + N + ' Z ' + Z + ' V ' + V);
	return cycles[0x07];
}
