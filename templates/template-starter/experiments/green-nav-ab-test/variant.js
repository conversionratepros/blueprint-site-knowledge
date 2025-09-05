/**
 * Green Navigation Bar A/B Test - JavaScript Implementation
 * Experiment ID: green-nav-ab-test
 * Platform: Convert.com
 * 
 * This script ensures reliable application of green navigation styling
 * across different website implementations and handles edge cases.
 */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        GREEN_COLOR: '#22c55e',
        TEXT_COLOR: '#ffffff',
        WAIT_TIMEOUT: 5000,
        CHECK_INTERVAL: 100,
        MAX_ATTEMPTS: 50
    };
    
    // Navigation selectors in order of priority
    const NAVIGATION_SELECTORS = [
        'nav',
        'header nav',
        '.navbar',
        '.navigation',
        '.nav-container',
        '#navigation',
        '#navbar',
        '#main-nav',
        '.main-navigation',
        '.primary-navigation',
        '.site-navigation',
        '[role="navigation"]',
        '.nav-header',
        '.navbar-header',
        '.header-nav',
        '.top-nav',
        '.main-nav',
        '.primary-nav',
        // Framework-specific
        '.navbar-default',
        '.navbar-light',
        '.navbar-dark',
        '.top-bar',
        '.menu-bar',
        '.mdc-top-app-bar',
        '.mat-toolbar',
        '.v-toolbar'
    ];
    
    // Utility function to wait for element
    function waitForElement(selector, callback, timeout = CONFIG.WAIT_TIMEOUT) {
        const startTime = Date.now();
        const attempts = Math.floor(timeout / CONFIG.CHECK_INTERVAL);
        let currentAttempt = 0;
        
        function checkElement() {
            const element = document.querySelector(selector);
            
            if (element) {
                callback(element);
                return;
            }
            
            currentAttempt++;
            if (currentAttempt < attempts && (Date.now() - startTime) < timeout) {
                setTimeout(checkElement, CONFIG.CHECK_INTERVAL);
            } else {
                console.log(`Green Nav Test: Element not found: ${selector}`);
            }
        }
        
        checkElement();
    }
    
    // Apply green styling to element
    function applyGreenStyling(element) {
        try {
            if (!element || element.dataset.greenNavApplied) {
                return;
            }
            
            // Mark element as processed
            element.dataset.greenNavApplied = 'true';
            
            // Apply background color
            element.style.setProperty('background-color', CONFIG.GREEN_COLOR, 'important');
            element.style.setProperty('background-image', 'none', 'important');
            
            // Apply text color to child elements
            const textElements = element.querySelectorAll('a, span, p, div, button, .nav-link, .navbar-nav li');
            textElements.forEach(function(textElement) {
                if (!textElement.closest('.logo, .brand, .navbar-brand')) {
                    textElement.style.setProperty('color', CONFIG.TEXT_COLOR, 'important');
                }
            });
            
            // Track successful application
            trackEvent('green_nav_applied', {
                selector: getElementSelector(element),
                timestamp: Date.now()
            });
            
        } catch (error) {
            console.error('Green Nav Test: Error applying styling:', error);
            trackEvent('green_nav_error', {
                error: error.message,
                element: element ? element.tagName : 'unknown'
            });
        }
    }
    
    // Get a descriptive selector for an element
    function getElementSelector(element) {
        if (element.id) return `#${element.id}`;
        if (element.className) {
            const classes = element.className.split(' ').filter(cls => cls.length > 0);
            if (classes.length > 0) return `.${classes[0]}`;
        }
        return element.tagName.toLowerCase();
    }
    
    // Track events for analytics
    function trackEvent(eventName, data) {
        try {
            // Convert.com tracking
            if (window._conv_q && typeof window._conv_q.push === 'function') {
                window._conv_q.push(['trackConversion', eventName, data]);
            }
            
            // Google Analytics tracking (if available)
            if (window.gtag && typeof window.gtag === 'function') {
                window.gtag('event', eventName, {
                    custom_parameter_1: JSON.stringify(data),
                    event_category: 'green_nav_test'
                });
            }
            
            // Universal Analytics tracking (if available)
            if (window.ga && typeof window.ga === 'function') {
                window.ga('send', 'event', 'green_nav_test', eventName, JSON.stringify(data));
            }
            
            console.log(`Green Nav Test: ${eventName}`, data);
            
        } catch (error) {
            console.error('Green Nav Test: Tracking error:', error);
        }
    }
    
    // Apply styling to all found navigation elements
    function applyToAllNavigations() {
        let elementsFound = 0;
        
        NAVIGATION_SELECTORS.forEach(function(selector) {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(function(element) {
                    applyGreenStyling(element);
                    elementsFound++;
                });
            } catch (error) {
                console.error(`Green Nav Test: Error with selector ${selector}:`, error);
            }
        });
        
        if (elementsFound === 0) {
            console.warn('Green Nav Test: No navigation elements found');
            trackEvent('green_nav_no_elements', {
                selectors_tried: NAVIGATION_SELECTORS.length,
                timestamp: Date.now()
            });
        }
        
        return elementsFound;
    }
    
    // Handle dynamic content and late-loading elements
    function setupObserver() {
        if (!window.MutationObserver) {
            return;
        }
        
        const observer = new MutationObserver(function(mutations) {
            let shouldCheck = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        const node = mutation.addedNodes[i];
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if added node is or contains navigation
                            NAVIGATION_SELECTORS.forEach(function(selector) {
                                try {
                                    if (node.matches && node.matches(selector) || 
                                        node.querySelector && node.querySelector(selector)) {
                                        shouldCheck = true;
                                    }
                                } catch (e) {
                                    // Selector might not be valid for this node
                                }
                            });
                        }
                    }
                }
            });
            
            if (shouldCheck) {
                setTimeout(applyToAllNavigations, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Clean up observer after 30 seconds
        setTimeout(function() {
            observer.disconnect();
        }, 30000);
    }
    
    // Initialize the experiment
    function init() {
        try {
            trackEvent('green_nav_init', {
                userAgent: navigator.userAgent,
                url: window.location.href,
                timestamp: Date.now()
            });
            
            // Apply immediately to any existing elements
            const immediateElements = applyToAllNavigations();
            
            // Wait for common navigation elements
            NAVIGATION_SELECTORS.slice(0, 5).forEach(function(selector) {
                waitForElement(selector, applyGreenStyling);
            });
            
            // Setup mutation observer for dynamic content
            setupObserver();
            
            // Fallback: reapply after page load
            if (document.readyState !== 'complete') {
                window.addEventListener('load', function() {
                    setTimeout(applyToAllNavigations, 500);
                });
            }
            
            console.log('Green Nav Test: Initialized successfully');
            
        } catch (error) {
            console.error('Green Nav Test: Initialization error:', error);
            trackEvent('green_nav_init_error', {
                error: error.message,
                stack: error.stack
            });
        }
    }
    
    // Start the experiment
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();