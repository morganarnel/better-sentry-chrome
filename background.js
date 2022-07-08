function forceNavigation(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log(e);
    if (!e.target.hasAttribute('href')) {
        e.path.forEach(pathItem => {
            if (pathItem.hasAttribute('href')) {
                window.location.href = pathItem.href;
            }
        })
    } else {
        window.location.href = e.target.href;
    }
}

window.addEventListener('load', () => {
    console.info('[Better Sentry] Loaded');
    const currentURL = window.location.href;
    const referrer = document.referrer;

    if (currentURL.startsWith('https://sentry.io/organizations/') && currentURL.includes('?project=')) {
        const params = (new URL(document.location)).searchParams;
        let projectId = params.get('project');
        let lastProjectId = localStorage.getItem('last_project');

        if (lastProjectId && lastProjectId !== projectId && (referrer === '' || referrer === 'https://sentry.io')) {
            // First time accessing page, and current project is not our last accessed project so redirect back into last project
            window.location.href = window.location.href.split('?')[0] + '?project=' + lastProjectId
        } else if (projectId) {
            if (projectId !== lastProjectId) {
                localStorage.setItem('last_project', projectId);
                lastProjectId = projectId;
            }
        }
    }

    setInterval(() => {
        const params = (new URL(document.location)).searchParams;
        let projectId = params.get('project');
        let lastProjectId = localStorage.getItem('last_project');

        if (projectId) {
            if (projectId !== lastProjectId) {
                localStorage.setItem('last_project', projectId);
                lastProjectId = projectId;
            }
        }
        if (lastProjectId) {
            const sidebarItems = document.querySelectorAll('a[id|="sidebar-item"]');
            sidebarItems.forEach(function (sidebarItem) {
                if (sidebarItem.href.indexOf('?project') === -1 && sidebarItem.href.indexOf('&project') === -1) {
                    sidebarItem.setAttribute('data-original', sidebarItem.href);
                    sidebarItem.href = sidebarItem.href + '?project=' + lastProjectId;
                    sidebarItem.addEventListener('click', forceNavigation);
                } else if (sidebarItem.hasAttribute('data-original')) {
                    sidebarItem.href = sidebarItem.getAttribute('data-original') + '?project=' + lastProjectId;
                }
            });
        }
    }, 2500);
});