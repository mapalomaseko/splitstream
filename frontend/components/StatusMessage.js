export default function StatusMessage({ status, message, txHash }) {
  if (status === 'idle') return null;

  const styles = {
    loading: 'text-slate-500',
    success: 'text-brand-navy',
    error: 'text-rose-500',
  };

  const icons = {
    loading: '•',
    success: '✓',
    error: 'x',
  };

  return (
    <div className="mt-6 rounded-xl border border-brand-line bg-white p-4 text-left animate-fade-up">
      <p className={"text-sm font-medium " + styles[status]}>
        {icons[status]} {message}
      </p>
      {txHash && status === 'success' && (
        <a
          href={"https://sepolia.etherscan.io/tx/" + txHash}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-brand-navy hover:text-slate-700 mt-2 inline-block underline">
          View on Etherscan →
        </a>
      )}
    </div>
  );
}