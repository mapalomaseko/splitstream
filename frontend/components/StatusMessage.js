// ============================================================
// STUDENT 4 — STATUS MESSAGE COMPONENT
// ============================================================
// Reusable component for showing transaction states.
// Used on the Upload and Marketplace pages.
//
// TASKS:
// [ ] Handle 4 states: loading, success, error, idle
// [ ] For success: show a link to Etherscan using the txHash
// [ ] For error: show a human-readable message (not raw error object)
//
// USAGE:
//   <StatusMessage status="loading" message="Uploading to IPFS..." />
//   <StatusMessage status="success" message="Registered!" txHash="0x123..." />
//   <StatusMessage status="error" message="Transaction rejected." />
// ============================================================

export default function StatusMessage({ status, message, txHash }) {
  if (status === 'idle') return null;

  const styles = {
    loading: 'bg-yellow-800 text-yellow-200',
    success: 'bg-green-800 text-green-200',
    error: 'bg-red-800 text-red-200',
  };

  return (
    <div className={`p-4 rounded ${styles[status]}`}>
      <p>{message}</p>
      {txHash && (
        <a
          href={`https://sepolia.etherscan.io/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Etherscan →
        </a>
      )}
    </div>
  );
}
