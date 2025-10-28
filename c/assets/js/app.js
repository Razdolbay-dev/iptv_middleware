// Простая SPA и модульная система для TVIP S-410
(function () {
    'use strict';

    // Политика фокуса: для TV-пульта используем коды клавиш
    var KEY = {
        LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40,
        ENTER: 13, BACK: 8, RETURN: 461, // 461 часто используется в STB
        MENU: 77 // M
    };

    // Утилиты
    function byId(id){ return document.getElementById(id); }
    function el(tag, attrs, children){
        var e = document.createElement(tag);
        attrs = attrs || {};
        for (var k in attrs) {
            if (!attrs.hasOwnProperty(k)) continue;
            if (k === 'class') e.className = attrs[k];
            else if (k === 'text') e.textContent = attrs[k];
            else e.setAttribute(k, attrs[k]);
        }
        (children || []).forEach(function(c){ if (typeof c === 'string') e.appendChild(document.createTextNode(c)); else e.appendChild(c); });
        return e;
    }

    // Корневой контейнер
    var appEl = document.getElementById('app');

    // Состояние приложения
    var state = {
        route: 'main',   // main, tv, vod, radio, settings
        modules: {}
    };

    // Роутер (очень простой)
    function navigateTo(route, opts) {
        opts = opts || {};
        if (state.route === route && !opts.force) return;
        var from = state.route;
        state.route = route;
        render();
        // Простая история (работает в STB браузерах)
        try { window.history.pushState({route: route}, '', '#'+route); } catch(e) {}
        // фокусирование на первом элементе модуля
        setTimeout(function(){ focusFirst(); }, 60);
        console.log('navigate', from, '→', route);
    }

    // Инициализация модулей (регистрация)
    function register(name, module) {
        state.modules[name] = module;
        if (typeof module.init === 'function') {
            try { module.init(); } catch(e) { console.warn('init module', name, e); }
        }
    }

    // Рисует контейнер и вызывает модульные рендереры
    function render() {
        appEl.innerHTML = '';
        var wrapper = el('div', { class: 'portal-wrap' });
        // header
        wrapper.appendChild(renderHeader());

        var view = el('main', { class: 'portal-main' });
        var route = state.route;
        var mod = state.modules[route];
        if (mod && typeof mod.render === 'function') {
            view.appendChild(mod.render());
        } else {
            // fallback: ошибка/пусто
            view.appendChild(el('div', { class: 'empty' }, [ el('div', { class: 'empty-title', text: 'Раздел не реализован' }) ]));
        }
        wrapper.appendChild(view);

        // footer / version
        var footer = el('footer', { class: 'portal-footer' }, [ el('div', { text: 'TVIP Portal — Neo Flat • v0.1' }) ]);
        wrapper.appendChild(footer);

        appEl.appendChild(wrapper);
    }

    function renderHeader() {
        var hdr = el('header', { class: 'portal-header' });
        var left = el('div', { class: 'hdr-left' }, [
            el('div', { class: 'logo', text: 'tvip' }),
            el('div', { class: 'logo-sub', text: 'neo' })
        ]);
        var right = el('div', { class: 'hdr-right' }, [
            el('div', { class: 'datetime' }, [
                el('span', { class: 'date', text: formatDate(new Date()) }),
                el('span', { class: 'time', text: formatTime(new Date()) })
            ])
        ]);
        hdr.appendChild(left);
        hdr.appendChild(right);

        // обновляем время каждую минуту
        clearInterval(hdr._tick);
        hdr._tick = setInterval(function(){
            var d = new Date();
            var dt = hdr.querySelector('.date');
            var tm = hdr.querySelector('.time');
            if (dt) dt.textContent = formatDate(d);
            if (tm) tm.textContent = formatTime(d);
        }, 1000 * 30);

        return hdr;
    }

    function formatDate(d){
        var dd = pad(d.getDate()), mm = pad(d.getMonth()+1), yy = d.getFullYear();
        return dd + '.' + mm + '.' + yy;
    }
    function formatTime(d){
        return pad(d.getHours()) + ':' + pad(d.getMinutes());
    }
    function pad(n){ return (n<10? '0':'') + n; }

    // Фокус и навигация по плиткам (упрощённый)
    var focus = { x:0, y:0, nodes:[] };

    function focusFirst() {
        var nodes = appEl.querySelectorAll('[data-focusable]');
        focus.nodes = Array.prototype.slice.call(nodes);
        focus.index = 0;
        updateFocus();
    }

    function updateFocus() {
        focus.nodes.forEach(function(n,i){
            n.classList.toggle('focused', i === focus.index);
        });
        if (focus.nodes[focus.index]) {
            // скроллим контейнер так, чтобы элемент был виден (для больших экранов)
            focus.nodes[focus.index].scrollIntoView({behavior:'smooth', block:'center', inline:'center'});
        }
    }

    function moveFocus(dir) {
        if (!focus.nodes || focus.nodes.length === 0) return;
        // простое линейное поведение: left/right перемещает индекс
        var idx = focus.index || 0;
        if (dir === 'left') idx = Math.max(0, idx - 1);
        if (dir === 'right') idx = Math.min(focus.nodes.length - 1, idx + 1);
        if (dir === 'up') idx = Math.max(0, idx - 3);
        if (dir === 'down') idx = Math.min(focus.nodes.length - 1, idx + 3);
        if (idx !== focus.index) {
            focus.index = idx;
            updateFocus();
        }
    }

    function activateFocused() {
        var node = focus.nodes[focus.index];
        if (!node) return;
        var action = node.getAttribute('data-action');
        if (action) {
            handleAction(action, node);
        }
        // also trigger click for accessibility
        node.click();
    }

    function handleAction(action, node) {
        // action format: route:name or nav:some
        if (!action) return;
        var parts = action.split(':');
        if (parts[0] === 'nav') {
            navigateTo(parts[1]);
        } else if (parts[0] === 'exec') {
            try { (new Function(node.getAttribute('data-params') || ''))(); } catch(e) { console.error(e); }
        }
    }

    // Keyboard handling (pult)
    function onKey(e) {
        var code = e.keyCode || e.which;
        switch (code) {
            case KEY.LEFT: moveFocus('left'); e.preventDefault(); break;
            case KEY.RIGHT: moveFocus('right'); e.preventDefault(); break;
            case KEY.UP: moveFocus('up'); e.preventDefault(); break;
            case KEY.DOWN: moveFocus('down'); e.preventDefault(); break;
            case KEY.ENTER: activateFocused(); e.preventDefault(); break;
            case KEY.BACK:
            case KEY.RETURN:
                // back -> to main
                if (state.route !== 'main') { navigateTo('main'); e.preventDefault(); }
                break;
            case KEY.MENU:
                navigateTo('main'); e.preventDefault(); break;
            default:
                break;
        }
    }

    // Простые модули: main, tv, vod, radio, settings
    // Каждый модуль должен иметь render() возвращающий DOM
    // и опционально init()

    // MAIN MENU
    var mainModule = (function(){
        var items = [
            { id:'tv', title:'ТВ', subtitle:'Просмотр каналов', accent:true },
            { id:'vod', title:'Видео', subtitle:'Фильмы и сериалы' },
            { id:'radio', title:'Радио', subtitle:'Онлайн-станции' },
            { id:'settings', title:'Настройки', subtitle:'Система и сеть' }
        ];

        function render() {
            var container = el('section', { class: 'main-screen' });

            var hero = el('div', { class: 'main-hero' }, [
                el('div', { class: 'hero-title', text: 'Добро пожаловать' }),
                el('div', { class: 'hero-sub', text: 'Выберите раздел' })
            ]);
            container.appendChild(hero);

            var grid = el('div', { class: 'tile-grid' });
            items.forEach(function(it, idx){
                var tile = el('button', {
                    class: 'tile' + (it.accent? ' accent':''), 'data-focusable': true,
                    'data-action': 'nav:'+it.id, 'aria-label': it.title
                }, [
                    el('div', { class: 'tile-title', text: it.title }),
                    el('div', { class: 'tile-sub', text: it.subtitle })
                ]);
                grid.appendChild(tile);
            });
            container.appendChild(grid);

            // help line
            container.appendChild(el('div', { class: 'hint', text: '← → Навигация — Enter — выбрать — Back — назад' }));

            // установка фокусируемых нодов
            setTimeout(function(){ focusFirst(); }, 20);

            return container;
        }

        return { render: render, init: function(){ /* nothing */ } };
    })();

    // TV module (заглушка)
    var tvModule = (function(){
        function render() {
            var c = el('section', { class: 'module-screen' });
            c.appendChild(el('h2', { text: 'ТВ — Список каналов' }));
            var list = el('div', { class: 'list' });
            for (var i=1;i<=12;i++){
                list.appendChild(el('button', { class: 'list-item', 'data-focusable': true, 'data-action': 'exec:','text': 'Канал ' + i }));
            }
            c.appendChild(list);
            c.appendChild(el('div', { class: 'hint', text: 'Back — вернуться в меню' }));
            setTimeout(function(){ focusFirst(); }, 20);
            return c;
        }
        return { render: render, init: function(){ } };
    })();

    // VOD module (заглушка)
    var vodModule = (function(){
        function render() {
            var c = el('section', { class: 'module-screen' });
            c.appendChild(el('h2', { text: 'Видео — Видеотека' }));
            var grid = el('div', { class: 'vod-grid' });
            for (var i=1;i<=8;i++){
                grid.appendChild(el('button', { class: 'vod-card', 'data-focusable': true, 'data-action': 'exec:', 'text': 'Фильм ' + i }));
            }
            c.appendChild(grid);
            c.appendChild(el('div', { class: 'hint', text: 'Back — вернуться в меню' }));
            setTimeout(function(){ focusFirst(); }, 20);
            return c;
        }
        return { render: render, init: function(){ } };
    })();

    var radioModule = (function(){
        function render(){
            var c = el('section', { class: 'module-screen' });
            c.appendChild(el('h2', { text: 'Радио — Станции' }));
            var list = el('div', { class: 'list' });
            ['Русское Радио','Европа Плюс','Веселое Радио','Рок FM'].forEach(function(name){
                list.appendChild(el('button',{ class: 'list-item','data-focusable': true,'data-action':'exec:','text':name }));
            });
            c.appendChild(list);
            c.appendChild(el('div', { class: 'hint', text: 'Back — вернуться в меню' }));
            setTimeout(function(){ focusFirst(); }, 20);
            return c;
        }
        return { render: render, init: function(){ } };
    })();

    var settingsModule = (function(){
        function render(){
            var c = el('section', { class: 'module-screen' });
            c.appendChild(el('h2', { text: 'Настройки' }));
            var list = el('div', { class: 'list' });
            [['Сеть','network'],['Экран','display'],['О системе','about']].forEach(function(it){
                list.appendChild(el('button',{ class: 'list-item','data-focusable': true,'data-action':'exec:','text': it[0]}));
            });
            c.appendChild(list);
            c.appendChild(el('div', { class: 'hint', text: 'Back — вернуться в меню' }));
            setTimeout(function(){ focusFirst(); }, 20);
            return c;
        }
        return { render: render, init: function(){ } };
    })();

    // Регистрация модулей
    register('main', mainModule);
    register('tv', tvModule);
    register('vod', vodModule);
    register('radio', radioModule);
    register('settings', settingsModule);

    // Навигация при загрузке по хэшу
    window.addEventListener('popstate', function(e){
        var route = (location.hash && location.hash.substring(1)) || 'main';
        navigateTo(route, { force: true });
    });

    // Клавиатура
    window.addEventListener('keydown', onKey, false);

    // Первичный рендер
    navigateTo((location.hash && location.hash.substring(1)) || 'main');

    // Экспорт (отладка)
    window.__tvip = {
        navigateTo: navigateTo,
        register: register,
        state: state
    };

})();
