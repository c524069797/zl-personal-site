const BlogDetailLoading = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', gap: '24px', flexDirection: 'row' }}>
        {/* Main Content Skeleton */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Breadcrumb */}
          <div className="skeleton-line" style={{ width: '200px', height: '14px', marginBottom: '24px' }} />

          {/* Title */}
          <div className="skeleton-line" style={{ width: '80%', height: '32px', marginBottom: '16px' }} />
          <div className="skeleton-line" style={{ width: '50%', height: '32px', marginBottom: '24px' }} />

          {/* Meta info */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
            <div className="skeleton-line" style={{ width: '100px', height: '16px' }} />
            <div className="skeleton-line" style={{ width: '80px', height: '16px' }} />
            <div className="skeleton-line" style={{ width: '60px', height: '16px' }} />
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
            <div className="skeleton-line" style={{ width: '60px', height: '26px', borderRadius: '13px' }} />
            <div className="skeleton-line" style={{ width: '70px', height: '26px', borderRadius: '13px' }} />
            <div className="skeleton-line" style={{ width: '55px', height: '26px', borderRadius: '13px' }} />
          </div>

          {/* AI Summary */}
          <div className="skeleton" style={{ padding: '20px', marginBottom: '32px', border: '1px solid var(--border)' }}>
            <div className="skeleton-line" style={{ width: '100px', height: '16px', marginBottom: '12px' }} />
            <div className="skeleton-line" style={{ width: '100%', height: '14px', marginBottom: '8px' }} />
            <div className="skeleton-line" style={{ width: '90%', height: '14px' }} />
          </div>

          {/* Content lines */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="skeleton-line"
              style={{
                width: `${85 + Math.random() * 15}%`,
                height: '14px',
                marginBottom: '12px',
              }}
            />
          ))}
          <div className="skeleton-line" style={{ width: '40%', height: '14px', marginBottom: '32px' }} />

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
            <div className="skeleton-line" style={{ width: '90px', height: '36px', borderRadius: '8px' }} />
            <div className="skeleton-line" style={{ width: '90px', height: '36px', borderRadius: '8px' }} />
            <div className="skeleton-line" style={{ width: '90px', height: '36px', borderRadius: '8px' }} />
          </div>

          {/* Comments skeleton */}
          <div className="skeleton" style={{ padding: '24px', border: '1px solid var(--border)' }}>
            <div className="skeleton-line" style={{ width: '80px', height: '20px', marginBottom: '20px' }} />
            {[1, 2].map(i => (
              <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div className="skeleton-line" style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton-line" style={{ width: '100px', height: '14px', marginBottom: '8px' }} />
                  <div className="skeleton-line" style={{ width: '80%', height: '12px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div style={{ width: '280px', flexShrink: 0 }} className="hidden lg:block">
          <div className="skeleton" style={{ padding: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}>
            <div className="skeleton-line" style={{ width: '80px', height: '16px', marginBottom: '16px' }} />
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton-line" style={{ width: '100%', height: '14px', marginBottom: '12px' }} />
            ))}
          </div>
          <div className="skeleton" style={{ padding: '20px', border: '1px solid var(--border)' }}>
            <div className="skeleton-line" style={{ width: '60px', height: '16px', marginBottom: '16px' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="skeleton-line" style={{ width: `${50 + Math.random() * 30}px`, height: '24px', borderRadius: '4px' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetailLoading
