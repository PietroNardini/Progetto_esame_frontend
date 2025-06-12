
export interface Payslip {
  lordo: number;
  contributi: number;
  imponibile: number;
  tasse: number;
  netto: number;
}

/**  
 * Dati un lordo mensile, restituisce contributi (9,19%), imponibile, IRPEF e netto.  
 */
export function computePayslip(lordo: number): Payslip {
  // 1) contributi INPS 9,19%
  const contributi = round(lordo * 0.0919);
  // 2) imponibile
  const imponibile = round(lordo - contributi);
  // 3) tasse IRPEF a scaglioni (esempio semplificato)
  let tasse: number;
  if (imponibile <= 15000) {
    tasse = imponibile * 0.23;
  } else if (imponibile <= 28000) {
    tasse = 15000 * 0.23 + (imponibile - 15000) * 0.25;
  } else if (imponibile <= 50000) {
    tasse = 15000*0.23 + 13000*0.25 + (imponibile - 28000)*0.35;
  } else {
    tasse = 15000*0.23 + 13000*0.25 + 22000*0.35 + (imponibile - 50000)*0.43;
  }
  tasse = round(tasse);
  // 4) netto
  const netto = round(imponibile - tasse);

  return { lordo: round(lordo), contributi, imponibile, tasse, netto };
}

function round(v: number): number {
  return Math.round(v * 100) / 100;
}