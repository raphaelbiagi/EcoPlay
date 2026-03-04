'use client';

export default function FeedbackToast({ feedbacks }) {
    // Only show the latest feedback to avoid screen pollution
    const latest = feedbacks.length > 0 ? feedbacks[feedbacks.length - 1] : null;

    if (!latest) return null;

    return (
        <div className="feedback-container">
            <div key={latest.id} className={`feedback-msg ${latest.type}`}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
                    {latest.type === 'success' ? 'check_circle' : 'error'}
                </span>
                {latest.message}
            </div>
        </div>
    );
}
