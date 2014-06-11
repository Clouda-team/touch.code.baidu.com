define(
    function (require) {

        var  layerApi = {};
        layerApi.pageInitCallback = function (view, pageContainer, url, position) {
            if (pageContainer.initialized) return;
            pageContainer.initialized = true;
            // Page Data
            var pageData = {
                container: pageContainer,
                url: url,
                query: $.parseUrlQuery(url || ''),
                name: $(pageContainer).attr('data-page'),
                view: view,
                from: position
            };
            // Before Init Callback
            $(pageData.container).trigger('pageBeforeInit', {page: pageData});
            layerApi.initPage(pageContainer);
            // Init Callback
            $(pageData.container).trigger('pageInit', {page: pageData});
        };
        layerApi.pageAnimCallbacks = function (callback, view, params) {
            // Page Data
            var pageData = {
                container: params.pageContainer,
                url: params.url,
                query: $.parseUrlQuery(params.url || ''),
                name: $(params.pageContainer).attr('data-page'),
                view: view,
                from: params.position
            };
            var oldPage = params.oldPage,
                newPage = params.newPage;

            if (callback === 'after') {
                $(pageData.container).trigger('pageAfterAnimation', {page: pageData});

            }
            if (callback === 'before') {
                // Add data-page on view
                $(view.container).attr('data-page', pageData.name);

                // Hide/show navbar dynamically
                if (newPage.hasClass('no-navbar') && !oldPage.hasClass('no-navbar')) {
                    view.hideNavbar();
                }
                if (!newPage.hasClass('no-navbar') && oldPage.hasClass('no-navbar')) {
                    view.showNavbar();
                }
                // Hide/show navbar toolbar
                if (newPage.hasClass('no-toolbar') && !oldPage.hasClass('no-toolbar')) {
                    view.hideToolbar();
                }
                if (!newPage.hasClass('no-toolbar') && oldPage.hasClass('no-toolbar')) {
                    view.showToolbar();
                }
                // Callbacks
                $(pageData.container).trigger('pageBeforeAnimation', {page: pageData});
            }
        };

        // Init Page Events and Manipulations
        layerApi.initPage = function (pageContainer) {
            // Size navbars on page load
            if (layerApi.sizeNavbars) layerApi.sizeNavbars($(pageContainer).parents('.' + layerApi.params.viewClass)[0]);
            // Init messages
            if (layerApi.initMessages) layerApi.initMessages(pageContainer);
            // Init forms storage
            if (layerApi.initFormsStorage) layerApi.initFormsStorage(pageContainer);
            // Init smart select
            if (layerApi.initSmartSelects) layerApi.initSmartSelects(pageContainer);
        };

        // Load Page
        layerApi.allowPageChange = true;
        layerApi._tempDomElement = document.createElement('div');

        // Search required element in parsed content in related view
        function _findElement(selector, container, view) {
            container = $(container);
            var found = container.find(selector);
            if (found.length > 1) {
                if (typeof view.selector === 'string') {
                    // Search in related view
                    found = container.find(view.selector + ' ' + selector);
                }
                if (found.length > 1) {
                    // Search in main view
                    found = container.find('.' + layerApi.params.viewMainClass + ' ' + selector);
                }
            }
            if (found.length === 1) return found;
            else {
                return undefined;
            }
        }

        // Set pages classess for animation
        function _animatePages(leftPage, rightPage, direction, view) {
            // Loading new page
            if (direction === 'to-left') {
                leftPage.removeClass('page-on-center').addClass('page-from-center-to-left');
                rightPage.addClass('page-from-right-to-center');
            }
            // Go back
            if (direction === 'to-right') {
                leftPage.removeClass('page-on-left').addClass('page-from-left-to-center');
                rightPage.removeClass('page-on-center').addClass('page-from-center-to-right');
            }
        }

        // Set navbars classess for animation
        function _animateNavbars(leftNavbarInner, rightNavbarInner, direction, view) {
            // Loading new page
            if (direction === 'to-left') {
                rightNavbarInner.removeClass('navbar-on-right').addClass('navbar-from-right-to-center');
                rightNavbarInner.find('.sliding').each(function () {
                    var sliding = $(this);
                    sliding.transform('translate3d(0px,0,0)');
                    if (layerApi.params.animateNavBackIcon) {
                        if (sliding.hasClass('left') && sliding.find('.back .icon').length > 0) {
                            sliding.find('.back .icon').transform('translate3d(0px,0,0)');
                        }
                    }
                });

                leftNavbarInner.removeClass('navbar-on-center').addClass('navbar-from-center-to-left');
                leftNavbarInner.find('.sliding').each(function () {
                    var sliding = $(this);
                    if (layerApi.params.animateNavBackIcon) {
                        if (sliding.hasClass('center') && rightNavbarInner.find('.sliding.left .back .icon').length > 0) {
                            this.f7NavbarLeftOffset += rightNavbarInner.find('.sliding.left .back span')[0].offsetLeft;
                        }
                        if (sliding.hasClass('left') && sliding.find('.back .icon').length > 0) {
                            sliding.find('.back .icon').transform('translate3d(' + (-this.f7NavbarLeftOffset) + 'px,0,0)');
                        }
                    }
                    sliding.transform('translate3d(' + (this.f7NavbarLeftOffset) + 'px,0,0)');
                });
            }
            // Go back
            if (direction === 'to-right') {
                leftNavbarInner.removeClass('navbar-on-left').addClass('navbar-from-left-to-center');
                leftNavbarInner.find('.sliding').each(function () {
                    var sliding = $(this);
                    sliding.transform('translate3d(0px,0,0)');
                    if (layerApi.params.animateNavBackIcon) {
                        if (sliding.hasClass('left') && sliding.find('.back .icon').length > 0) {
                            sliding.find('.back .icon').transform('translate3d(0px,0,0)');
                        }
                    }
                });

                rightNavbarInner.removeClass('navbar-on-center').addClass('navbar-from-center-to-right');
                rightNavbarInner.find('.sliding').each(function () {
                    var sliding = $(this);
                    if (layerApi.params.animateNavBackIcon) {
                        if (sliding.hasClass('left') && sliding.find('.back .icon').length > 0) {
                            sliding.find('.back .icon').transform('translate3d(' + (-this.f7NavbarRightOffset) + 'px,0,0)');
                        }
                    }
                    sliding.transform('translate3d(' + (this.f7NavbarRightOffset) + 'px,0,0)');
                });
            }
        }
        function _load(view, url, content) {
            var viewContainer = $(view.container),
                newPage, oldPage, pagesInView, i, oldNavbarInner, newNavbarInner, navbar, dynamicNavbar;

            // Preprocess content
            if (layerApi.params.preprocess) {
                content = layerApi.params.preprocess(content, url);
            }

            // Clear temp div
            layerApi._tempDomElement.innerHTML = '';

            // Parse DOM
            if (url || (typeof content === 'string')) {
                layerApi._tempDomElement.innerHTML = content;
            } else {
                if ('length' in content && content.length > 1) {
                    for (var ci = 0; ci < content.length; ci++) {
                        $(layerApi._tempDomElement).append(content[ci]);
                    }
                } else {
                    $(layerApi._tempDomElement).append(content);
                }
            }
            
            // Subevents for iframes
            if (view.params.subEvents) {
                $(layerApi._tempDomElement).find('.page').each(function () {
                    var page = this;
                    $(page).find('iframe').on('load', function () {
                        view.attachSubEvents(page, this.contentWindow.document);
                    });
                });
            }

            // Find new page
            newPage = _findElement('.page', layerApi._tempDomElement, view);

            // If page not found exit
            if (!newPage) {
                layerApi.allowPageChange = true;
                return;
            }

            newPage.addClass('page-on-right');

            // Find old page (should be the last one) and remove older pages
            pagesInView = viewContainer.find('.page:not(.cached)');
            if (pagesInView.length > 1) {
                for (i = 0; i < pagesInView.length - 2; i++) {
                    if (!view.params.domCache)
                        $(pagesInView[i]).remove();
                    else
                        $(pagesInView[i]).addClass('cached');
                }
                if (!view.params.domCache)
                    $(pagesInView[i]).remove();
                else
                    $(pagesInView[i]).addClass('cached');
            }
            
            oldPage = viewContainer.find('.page:not(.cached)');

            // Dynamic navbar
            if (view.params.dynamicNavbar) {
                dynamicNavbar = true;
                // Find navbar
                newNavbarInner = _findElement('.navbar-inner', layerApi._tempDomElement, view);
                if (!newNavbarInner) {
                    dynamicNavbar = false;
                }
                navbar = viewContainer.find('.navbar');
                oldNavbarInner = navbar.find('.navbar-inner:not(.cached)');
                if (oldNavbarInner.length > 0) {
                    for (i = 0; i < oldNavbarInner.length - 1; i++) {
                        if (!view.params.domCache)
                            $(oldNavbarInner[i]).remove();
                        else
                            $(oldNavbarInner[i]).addClass('cached');
                    }
                    if (!newNavbarInner && oldNavbarInner.length === 1) {
                        if (!view.params.domCache)
                            $(oldNavbarInner[0]).remove();
                        else
                            $(oldNavbarInner[0]).addClass('cached');
                    }
                    oldNavbarInner = navbar.find('.navbar-inner:not(.cached)');
                }
            }
            if (dynamicNavbar) {
                newNavbarInner.addClass('navbar-on-right');
                navbar.append(newNavbarInner[0]);
            }

            // save content areas into view's cache
            if (!url) {
                url = '#content-' + view.history.length;

                if (!view.params.domCache) {
                    if (view.history.length === 1) {
                        view.contentCache[view.history[0]] = { nav: oldNavbarInner, page: oldPage };
                    }
                    view.contentCache[url] = { nav: newNavbarInner, page: newPage };
                }
            }

            // Update View history
            view.url = url;
            view.history.push(url);
            
            // Append Old Page and add classes for animation
            $(view.pagesContainer).append(newPage[0]);

            // Page Init Events
            layerApi.pageInitCallback(view, newPage[0], url, 'right');
            
            if (dynamicNavbar) {
                newNavbarInner.find('.sliding').each(function () {
                    var sliding = $(this);
                    sliding.transform('translate3d(' + (this.f7NavbarRightOffset) + 'px,0,0)');
                    if (layerApi.params.animateNavBackIcon) {
                        if (sliding.hasClass('left') && sliding.find('.back .icon').length > 0) {
                            sliding.find('.back .icon').transform('translate3d(' + (-this.f7NavbarRightOffset) + 'px,0,0)');
                        }
                    }
                });
            }
            // Force reLayout
            var clientLeft = newPage[0].clientLeft;

            // Before Anim Callback
            layerApi.pageAnimCallbacks('before', view, {pageContainer: newPage[0], url: url, position: 'left', oldPage: oldPage, newPage: newPage});

            // Set pages before animation
            _animatePages(oldPage, newPage, 'to-left', view);

            // Dynamic navbar animation
            if (dynamicNavbar) {
                setTimeout(function () {
                    _animateNavbars(oldNavbarInner, newNavbarInner, 'to-left', view);
                }, 0);
                    
            }

            newPage.animationEnd(function (e) {
                layerApi.allowPageChange = true;
                newPage.removeClass('page-from-right-to-center page-on-right').addClass('page-on-center');
                oldPage.removeClass('page-from-center-to-left').addClass('page-on-left');
                if (dynamicNavbar) {
                    newNavbarInner.removeClass('navbar-from-right-to-center').addClass('navbar-on-center');
                    oldNavbarInner.removeClass('navbar-from-center-to-left').addClass('navbar-on-left');
                }
                layerApi.pageAnimCallbacks('after', view, {pageContainer: newPage[0], url: url, position: 'right', oldPage: oldPage, newPage: newPage});
                if (layerApi.params.pushState) layerApi.pushStateClearQueue();
            });
        }
        layerApi.loadContent = function (view, content, pushState) {
            if (!layerApi.allowPageChange) return false;
            layerApi.allowPageChange = false;
            if (layerApi.xhr) {
                layerApi.xhr.abort();
                layerApi.xhr = false;
            }
            if (layerApi.params.pushState)  {
                if (typeof pushState === 'undefined') pushState = true;
                if (pushState) history.pushState({content: content, url: '#content-' + view.history.length}, '', '#/#content-' + view.history.length);
            }
            _load(view, null, content);

        };
        layerApi.loadPage = function (view, url, pushState) {
            if (!layerApi.allowPageChange) return false;
            if (view.url === url) return false;
            layerApi.allowPageChange = false;
            if (layerApi.xhr) {
                layerApi.xhr.abort();
                layerApi.xhr = false;
            }
            layerApi.get(url, function (data, error) {
                if (error) {
                    layerApi.allowPageChange = true;
                    return;
                }
                if (layerApi.params.pushState)  {
                    if (typeof pushState === 'undefined') pushState = true;
                    if (pushState) history.pushState({url: url}, '', '#/' + url);
                }

                _load(view, url, data);

            });
        };
        layerApi.goBack = function (view, url, preloadOnly, pushState) {
            if (!layerApi.allowPageChange) return false;
            layerApi.allowPageChange = false;
            if (layerApi.xhr) {
                layerApi.xhr.abort();
                layerApi.xhr = false;
            }
            if (layerApi.params.pushState)  {
                if (typeof pushState === 'undefined') pushState = true;
                if (!preloadOnly && history.state && pushState) {
                    history.back();
                }
            }

            var viewContainer = $(view.container),
                pagesInView = viewContainer.find('.page'),
                oldPage, newPage, oldNavbarInner, newNavbarInner, navbar, dynamicNavbar;
            function _animate() {
                // Page before animation callback
                layerApi.pageAnimCallbacks('before', view, {pageContainer: newPage[0], url: url, position: 'left', oldPage: oldPage, newPage: newPage});

                // Set pages before animation
                _animatePages(newPage, oldPage, 'to-right', view);

                // Dynamic navbar animation
                if (dynamicNavbar) {
                    setTimeout(function () {
                        _animateNavbars(newNavbarInner, oldNavbarInner, 'to-right', view);
                    }, 0);
                }
                
                newPage.animationEnd(function () {
                    layerApi.afterGoBack(view, oldPage[0], newPage[0]);
                    layerApi.pageAnimCallbacks('after', view, {pageContainer: newPage[0], url: url, position: 'left', oldPage: oldPage, newPage: newPage});
                });
            }
            function _preload() {
                newPage = _findElement('.page', layerApi._tempDomElement, view);

                // If pages not found or there are still more than one, exit
                if (!newPage) {
                    layerApi.allowPageChange = true;
                    return;
                }
                newPage.addClass('page-on-left');

                // Find old page (should be the only one)
                oldPage = $(viewContainer.find('.page')[0]);

                // Dynamic navbar
                if (view.params.dynamicNavbar) {
                    dynamicNavbar = true;
                    // Find navbar
                    newNavbarInner = _findElement('.navbar-inner', layerApi._tempDomElement, view);
                    if (!newNavbarInner) {
                        dynamicNavbar = false;
                    }
                    
                }

                if (dynamicNavbar) {
                    navbar = viewContainer.find('.navbar');
                    oldNavbarInner = navbar.find('.navbar-inner');
                    newNavbarInner.addClass(oldNavbarInner.length > 0 ? 'navbar-on-left' : 'navbar-on-center');
                    if (oldNavbarInner.length > 1) {
                        $(oldNavbarInner[0]).remove();
                        oldNavbarInner = navbar.find('.navbar-inner');
                    }
                    navbar.prepend(newNavbarInner[0]);
                }
                // Prepend new Page and add classes for animation
                $(view.pagesContainer).prepend(newPage[0]);

                // Page Init Events
                layerApi.pageInitCallback(view, newPage[0], url, 'left');

                if (dynamicNavbar && newNavbarInner.hasClass('navbar-on-left')) {
                    newNavbarInner.find('.sliding').each(function () {
                        var sliding = $(this);
                        if (layerApi.params.animateNavBackIcon) {
                            if (sliding.hasClass('left') && sliding.find('.back .icon').length > 0) {
                                sliding.find('.back .icon').transform('translate3d(' + (-this.f7NavbarLeftOffset) + 'px,0,0)');
                            }
                            if (sliding.hasClass('center') && oldNavbarInner.find('.left .back .icon').length > 0) {
                                this.f7NavbarLeftOffset += oldNavbarInner.find('.left .back span')[0].offsetLeft;
                            }
                        }
                        sliding.transform('translate3d(' + (this.f7NavbarLeftOffset) + 'px,0,0)');
                    });
                }

                // Exit if we need only to preload page
                if (preloadOnly) {
                    newPage.addClass('page-on-left');
                    layerApi.allowPageChange = true;
                    return;
                }

                // Update View's URL
                view.url = url;

                // Force reLayout
                var clientLeft = newPage[0].clientLeft;

                _animate();
            }

            if (pagesInView.length > 1) {
                // Exit if only preloadOnly
                if (preloadOnly) {
                    layerApi.allowPageChange = true;
                    return;
                }
                // Update View's URL
                view.url = view.history[view.history.length - 2];

                // Define old and new pages
                newPage = $(pagesInView[pagesInView.length - 2]);
                oldPage = $(pagesInView[pagesInView.length - 1]);

                // Dynamic navbar
                if (view.params.dynamicNavbar) {
                    dynamicNavbar = true;
                    // Find navbar
                    var inners = viewContainer.find('.navbar-inner:not(.cached)');
                    newNavbarInner = $(inners[0]);
                    oldNavbarInner = $(inners[1]);
                }
                _animate();
            }
            else {
                if (url && url.indexOf('#') === 0) url = undefined;
                if (view.history.length > 1) {
                    url = view.history[view.history.length - 2];
                }
                if (!url) {
                    layerApi.allowPageChange = true;
                    return;
                }
                
                // Check current url is in cache?
                if (!view.params.domCache && (url in view.contentCache)) {
                    var _cache = view.contentCache[url];
                    layerApi._tempDomElement.innerHTML = '';
                    $(layerApi._tempDomElement).append(_cache.nav[0]).append(_cache.page[0]);
                    _preload();
                    return;
                }

                layerApi.get(url, function (data, error) {
                    if (error) {
                        layerApi.allowPageChange = true;
                        return;
                    }
                    if (layerApi.params.preprocess) {
                        data = layerApi.params.preprocess(data, url);
                    }
                    layerApi._tempDomElement.innerHTML = data;
                    _preload();
                });
            }
        };
        layerApi.afterGoBack = function (view, oldPage, newPage) {
            // Remove old page and set classes on new one
            oldPage = $(oldPage);
            newPage = $(newPage);
            oldPage.remove();
            newPage.removeClass('page-from-left-to-center page-on-left').addClass('page-on-center');
            layerApi.allowPageChange = true;
            // Updated dynamic navbar
            if (view.params.dynamicNavbar) {
                var inners = $(view.container).find('.navbar-inner:not(.cached)');
                var oldNavbar = $(inners[1]).remove();
                var newNavbar = $(inners[0]).removeClass('navbar-on-left navbar-from-left-to-center').addClass('navbar-on-center');

                if (layerApi.params.preloadPreviousPage && view.params.domCache) {
                    var cachedNavs = $(view.container).find('.navbar-inner.cached');
                    $(cachedNavs[cachedNavs.length - 1]).removeClass('cached');
                }
            }
            // Update View's History
            view.history.pop();
            
            // Check current page is content based only
            if (!view.params.domCache && view.url && view.url.indexOf('#content-') > -1 && (view.url in view.contentCache)) {
                view.contentCache[view.url] = null;
                delete view.contentCache[view.url];
            }
            
            if (layerApi.params.pushState) layerApi.pushStateClearQueue();

            // Preload previous page
            if (layerApi.params.preloadPreviousPage) {
                if (view.params.domCache) {
                    var cachedPages = $(view.container).find('.page.cached');
                    $(cachedPages[cachedPages.length - 1]).removeClass('cached');
                }
                layerApi.goBack(view, false, true);
            }

        };
});