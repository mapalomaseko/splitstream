export default function StatusMessage({ status, message, txHash }) {
  if (status === 'idle') return null;

  const styles = {
    loading: 'text-gray-400',
    success: 'text-green-500',
    error: 'text-red-400',
  };

  const icons = {
    loading: '○',
    success: '✓',
    error: '✕',
  };

  return (
    <div className="mt-6 text-center">
      <p className={"text-sm " + styles[status]}>
        {icons[status]} {message}
      </p>
      {txHash && status === 'success' && (
        
          href={"https://sepolia.etherscan.io/tx/" + txHash}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-gray-900 mt-1 block">
          View on Etherscan →
        </a>
      )}
    </div>
  );
}