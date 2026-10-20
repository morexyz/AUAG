// Prices and quantities below are a normalized illustration, never live inputs or a trading signal.
export function ratioWeights(relativeSilverMove=0){
 const change=Math.max(-40,Math.min(40,Number(relativeSilverMove)||0))/100;
 const gold=1/(2+change)*100;
 return {gold:+gold.toFixed(1),silver:+(100-gold).toFixed(1),move:Math.round(change*100)};
}
