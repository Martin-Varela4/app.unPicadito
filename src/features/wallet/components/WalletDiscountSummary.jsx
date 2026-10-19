import { useWalletStore } from "../store/useWalletStore";

export const WalletDiscountSummary = ({ costoTotal }) => {
  const { saldoCredito } = useWalletStore();

  const costo = Number(costoTotal || 0);
  const descuento = Math.min(Number(saldoCredito || 0), costo);
  const totalAPagar = Math.max(0, costo - descuento);

  return (
    <div className="space-y-3 border-b border-gray-100 pb-4 text-sm text-gray-600 mb-4">
      <div className="flex justify-between">
        <span>Costo del partido:</span>
        <span className="font-semibold text-gray-900">${costo.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-emerald-600">
        <span>Descuento (Saldo a Favor):</span>
        <span className="font-semibold">-${descuento.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t">
        <span>Total final a pagar:</span>
        <span>${totalAPagar.toFixed(2)}</span>
      </div>
    </div>
  );
};
