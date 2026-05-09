import { Spin } from 'antd'

const BlogListLoading = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Header skeleton */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div className="skeleton-line" style={{ width: '200px', height: '36px', margin: '0 auto 16px' }} />
        <div className="skeleton-line" style={{ width: '400px', height: '16px', margin: '0 auto' }} />
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Main list skeleton */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="skeleton"
              style={{
                marginBottom: '24px',
                padding: '24px',
                border: '1px solid var(--border)',
              }}
            >
              <div className="skeleton-line" style={{ width: '80px', height: '22px', marginBottom: '16px' }} />
              <div className="skeleton-line" style={{ width: '70%', height: '24px', marginBottom: '12px' }} />
              <div className="skeleton-line" style={{ width: '100%', height: '14px', marginBottom: '8px' }} />
              <div className="skeleton-line" style={{ width: '85%', height: '14px', marginBottom: '16px' }} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <div className="skeleton-line" style={{ width: '60px', height: '24px', borderRadius: '12px' }} />
                <div className="skeleton-line" style={{ width: '50px', height: '24px', borderRadius: '12px' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar skeleton */}
        <div style={{ width: '280px', flexShrink: 0 }} className="hidden lg:block">
          {/* Search */}
          <div className="skeleton" style={{ padding: '16px', marginBottom: '20px', border: '1px solid var(--border)' }}>
            <div className="skeleton-line" style={{ width: '100%', height: '40px', borderRadius: '8px' }} />
          </div>
          {/* Categories */}
          <div className="skeleton" style={{ padding: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}>
            <div className="skeleton-line" style={{ width: '80px', height: '16px', marginBottom: '16px' }} />
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div className="skeleton-line" style={{ width: '80px', height: '14px' }} />
                <div className="skeleton-line" style={{ width: '20px', height: '14px' }} />
              </div>
            ))}
          </div>
          {/* Tags */}
          <div className="skeleton" style={{ padding: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}>
            <div className="skeleton-line" style={{ width: '60px', height: '16px', marginBottom: '16px' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="skeleton-line" style={{ width: `${45 + Math.random() * 35}px`, height: '24px', borderRadius: '4px' }} />
              ))}
            </div>
          </div>
          {/* Hot posts */}
          <div className="skeleton" style={{ padding: '20px', border: '1px solid var(--border)' }}>
            <div className="skeleton-line" style={{ width: '80px', height: '16px', marginBottom: '16px' }} />
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton-line" style={{ width: '100%', height: '14px', marginBottom: '12px' }} />
            ))}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <Spin />
      </div>
    </div>
  )
}

export default BlogListLoading
