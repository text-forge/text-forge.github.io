document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.setAttribute('aria-expanded', 'false');
        
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        });
        
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(10, 10, 15, 0.95)';
        } else {
            header.style.background = 'rgba(10, 10, 15, 0.8)';
        }
        
        lastScrollY = currentScrollY;
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .screenshot-card, .section-header').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });

    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroContent) {
        heroContent.style.opacity = '0';
        setTimeout(() => {
            heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroContent.style.opacity = '1';
        }, 100);
    }
    
    if (heroVisual) {
        heroVisual.style.opacity = '0';
        heroVisual.style.transform = 'translateY(20px)';
        setTimeout(() => {
            heroVisual.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroVisual.style.opacity = '1';
            heroVisual.style.transform = 'translateY(0)';
        }, 300);
    }

    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.05}s`;
    });
});

window.TextForge = {
    version: '0.2-rc1',
    
    scrollToSection: function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = section.getBoundingClientRect().top + window.scrollY - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    },
    
    loadBlogPosts: async function() {
        const container = document.getElementById('blog-posts');
        if (!container) return;
        
        try {
            const response = await fetch('data/posts.json');
            const data = await response.json();
            
            container.innerHTML = data.posts.map(post => {
                const tagClass = post.tag === 'release' ? 'release' : 
                                 post.tag === 'feature' ? 'feature' : '';
                const versionBadge = post.version ? 
                    `<span class="version-badge">${post.version}</span>` : '';
                const featuredClass = post.featured ? 'blog-card-featured' : '';
                
                return `
                    <article class="blog-card ${featuredClass}">
                        <div class="blog-card-content">
                            <div class="blog-card-meta">
                                <span class="blog-card-tag ${tagClass}">${post.tag}</span>
                                <span class="blog-card-date">${post.date}</span>
                            </div>
                            <h2 class="blog-card-title">
                                ${versionBadge}
                                ${post.title}
                            </h2>
                            <p class="blog-card-excerpt">${post.excerpt}</p>
                            <a href="${post.link}" class="blog-card-link" target="_blank">
                                Read more
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                            </a>
                        </div>
                    </article>
                `;
            }).join('');
        } catch (error) {
            console.log('Blog posts loaded from static HTML');
        }
    }
};

if (document.getElementById('blog-posts')) {
    window.TextForge.loadBlogPosts();
}
