import { useEffect } from "react";
import { useWalletStore } from "../store/useWalletStore";

export const WalletWidget = () => {
  const { saldoCredito, isLoading, error, fetchSaldo } = useWalletStore();

  useEffect(() => {
    fetchSaldo();
  }, [fetchSaldo]);

  return (
    <div className="p-5 bg-slate-900 rounded-2xl text-white shadow-md max-w-xs">
      <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
        Billetera Virtual
      </span>
      <div className="mt-2 flex items-center justify-between">
        <h4 className="text-xl font-bold">Saldo a Favor</h4>
        {isLoading && (
          <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        )}
      </div>
      {error ? (
        <p className="text-xs text-rose-400 mt-2">{error}</p>
      ) : (
        <p className="text-3xl font-extrabold text-emerald-400 mt-1">
          $
          {saldoCredito.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      )}
    </div>
  );
};
