import { ref, watch, onMounted, onUnmounted } from 'vue'

/**
 * Composable for scroll spy functionality
 * Tracks which section is currently active based on scroll position
 * 
 * @param {Object} options - Configuration options
 * @param {Array} options.items - Navigation items array (must have 'id' property)
 * @param {Ref} options.container - Ref to the scrollable container element
 * @param {Number} options.offset - Bottom detection threshold in pixels (default: 50)
 * @param {String} options.rootMargin - IntersectionObserver rootMargin (default: '-5% 0px -40% 0px')
 * @param {Array} options.threshold - IntersectionObserver threshold array
 * @returns {Ref} activeSection - Reactive reference to the currently active section ID
 */
export function useScrollSpy(options = {}) {
    const {
        items = [],
        container = ref(null),
        offset = 50,
        rootMargin = '-5% 0px -40% 0px',
        threshold = [0, 0.1, 0.25, 0.4, 0.6, 0.8, 1]
    } = options

    const activeSection = ref(items.length > 0 ? items[0].id : '')
    let observer = null
    let scrollContainer = null

    /**
   * Initialize scroll spy when container is available
   */
    const initializeScrollSpy = () => {
        // Determine scroll target: container element or window
        scrollContainer = container.value
        const useWindow = !scrollContainer

        if ((!scrollContainer && !useWindow) || items.length === 0) {
            console.warn('useScrollSpy: Container or items not available')
            return
        }

        // Get actual scroll container or use document element for window scroll
        const observerRoot = useWindow ? null : scrollContainer
        const scrollTarget = useWindow ? window : scrollContainer

        // Create IntersectionObserver
        observer = new IntersectionObserver(
            (entries) => {
                // Get scroll measurements
                let scrollHeight, scrollTop, clientHeight
                if (useWindow) {
                    scrollHeight = document.documentElement.scrollHeight
                    scrollTop = window.scrollY || window.pageYOffset
                    clientHeight = window.innerHeight
                } else {
                    scrollHeight = scrollContainer.scrollHeight
                    scrollTop = scrollContainer.scrollTop
                    clientHeight = scrollContainer.clientHeight
                }

                // Check if we're at the bottom FIRST
                const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < offset

                if (isAtBottom) {
                    // Force highlight the last navigation item when at bottom
                    const lastItemId = items[items.length - 1].id
                    activeSection.value = lastItemId
                    return
                }

                // Filter to only intersecting entries
                const intersecting = entries
                    .filter(entry => entry.isIntersecting)
                    .map(entry => ({
                        id: entry.target.id,
                        ratio: entry.intersectionRatio,
                        top: entry.boundingClientRect.top,
                        bottom: entry.boundingClientRect.bottom
                    }))

                // If we have intersecting sections, find the most prominent one
                if (intersecting.length > 0) {
                    // Find the section with highest visibility and closest to top
                    intersecting.sort((a, b) => {
                        // Prioritize sections with significant visibility (>10%)
                        if (Math.abs(a.ratio - b.ratio) > 0.1) {
                            return b.ratio - a.ratio
                        }
                        // If similar visibility, choose the one closer to the top
                        return a.top - b.top
                    })

                    activeSection.value = intersecting[0].id
                }
            },
            {
                root: observerRoot,
                threshold,
                rootMargin
            }
        )

        // Observe each section
        items.forEach(item => {
            const section = document.getElementById(item.id)
            if (section) {
                observer.observe(section)
            }
        })

        // Handle scroll events for bottom detection
        const handleScroll = () => {
            let scrollHeight, scrollTop, clientHeight
            if (useWindow) {
                scrollHeight = document.documentElement.scrollHeight
                scrollTop = window.scrollY || window.pageYOffset
                clientHeight = window.innerHeight
            } else {
                scrollHeight = scrollContainer.scrollHeight
                scrollTop = scrollContainer.scrollTop
                clientHeight = scrollContainer.clientHeight
            }

            const isNearBottom = (scrollHeight - scrollTop - clientHeight) < offset

            if (isNearBottom) {
                // Force highlight the last navigation item when at bottom
                const lastItemId = items[items.length - 1].id
                if (document.getElementById(lastItemId)) {
                    activeSection.value = lastItemId
                }
            }
        }

        scrollTarget.addEventListener('scroll', handleScroll)

        // Return cleanup function
        return () => {
            scrollTarget.removeEventListener('scroll', handleScroll)
            if (observer) {
                observer.disconnect()
            }
        }
    }
    // Store current cleanup function
    let currentCleanup = null

    const cleanup = () => {
        if (currentCleanup) {
            currentCleanup()
            currentCleanup = null
        }
    }

    // Watch for container availability
    watch(container, (newContainer) => {
        cleanup() // Cleanup previous observer if any
        if (newContainer) {
            currentCleanup = initializeScrollSpy()
        }
    }, { immediate: true })

    // Ensure cleanup on unmount
    onUnmounted(() => {
        cleanup()
    })

    return activeSection
}
