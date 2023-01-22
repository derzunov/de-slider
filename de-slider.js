( () => {
    const createDeSlider = ( sliderSelector = '.de-slider' ) => {

        // Constants
        const TRANSITION_TIME = 1200; // ms
        const DOM_RENDER_DELAY = 20; // ms

        // Elements
        const $slider = document.querySelector( sliderSelector )
        const $sliderLine = $slider.querySelector( '.de-slider__line' )
        const $sliderSlides = $sliderLine.querySelectorAll( '.de-slider__slide' )

        // Vars
        let sliderWidth = $slider.clientWidth
        let slidesLength = $sliderSlides.length
        let sliderLineWidth = sliderWidth * slidesLength + sliderWidth * 2
        let autoSlidingInterval = null
        let activeSlideIndex = 1

        // Templates
        const prevElementTemplate = '<div class="de-slider__control de-slider__control_prev">\n' +
            '      <svg id="Layer_1" version="1.1" viewBox="0 0 128 128"\n' +
            '           xml:space="preserve" xmlns="http://www.w3.org/2000/svg"\n' +
            '           xmlns:xlink="http://www.w3.org/1999/xlink">\n' +
            '        <g>\n' +
            '          <line style="stroke-width:12;stroke-linecap:square;stroke-miterlimit:10;" x1="40.5" x2="87.5" y1="17" y2="64"/>\n' +
            '          <line style="stroke-width:12;stroke-linecap:square;stroke-miterlimit:10;" x1="87.5" x2="40.5" y1="64" y2="111"/>\n' +
            '        </g>\n' +
            '      </svg>\n' +
            '    </div>'

        const nextElementTemplate = '<div class="de-slider__control de-slider__control_next">\n' +
            '      <svg id="Layer_1" version="1.1" viewBox="0 0 128 128"\n' +
            '           xml:space="preserve" xmlns="http://www.w3.org/2000/svg"\n' +
            '           xmlns:xlink="http://www.w3.org/1999/xlink">\n' +
            '        <g>\n' +
            '          <line style="stroke-width:12;stroke-linecap:square;stroke-miterlimit:10;" x1="40.5" x2="87.5" y1="17" y2="64"/>\n' +
            '          <line style="stroke-width:12;stroke-linecap:square;stroke-miterlimit:10;" x1="87.5" x2="40.5" y1="64" y2="111"/>\n' +
            '        </g>\n' +
            '      </svg>\n' +
            '    </div>'

        // Private methods
        const addAnimation = () => {
            $sliderLine.style.transition = `transform ${ TRANSITION_TIME }ms cubic-bezier(.52,0,.42,1)`
        }

        const removeAnimation = () => {
            $sliderLine.style.transition = 'none'
        }

        const createElementFromHTML = ( htmlString ) => {
            const div = document.createElement( 'div' )
            div.innerHTML = htmlString.trim()
            return div.firstChild
        }

        // Code
        const $sliderPrev = createElementFromHTML( prevElementTemplate )
        const $sliderNext = createElementFromHTML( nextElementTemplate )
        $slider.append( $sliderPrev )
        $slider.append( $sliderNext )

        $sliderLine.append( $sliderSlides[ 0 ].cloneNode( true ) )
        $sliderLine.prepend( $sliderSlides[ slidesLength - 1 ].cloneNode( true ) )

        $sliderLine.style.width = `${ sliderLineWidth }px`
        $sliderLine.style.transform = `translateX(-${ activeSlideIndex * sliderWidth }px)`

        // Включаем анимацию после подготовки DOM
        setTimeout( () => {
            addAnimation()
        }, DOM_RENDER_DELAY )

        // Methods
        const showSlideByIndex = ( slideIndex ) => {
            $sliderLine.style.transform = `translateX(-${ slideIndex * sliderWidth }px)`
            activeSlideIndex = slideIndex
        }
        const next = () => {
            if ( activeSlideIndex >= slidesLength - 1 ) {
                // Сначала слайдимся на склонированный в конец первый слайд с анимацией
                showSlideByIndex( activeSlideIndex + 1 )

                // Ждём окончания анимации
                setTimeout( () => {
                    // Отключаем анимацию
                    removeAnimation()

                    // Без анимации незаметно переключаемся на нулевой слайд
                    showSlideByIndex( 0 )
                    // Возвращаем анимацию, дав браузеру немного времени на перерендер без анимации на нулевой элемент
                    setTimeout( () => {
                        // Возвращаем анимацию
                        addAnimation()
                    }, DOM_RENDER_DELAY )
                }, TRANSITION_TIME )
            } else {
                showSlideByIndex( activeSlideIndex + 1 )
            }
        }
        const prev = () => {
            if ( activeSlideIndex <= 1 ) {
                // Сначала слайдимся на склонированный в начало последний слайд с анимацией
                showSlideByIndex( activeSlideIndex - 1 )

                // Ждём окончания анимации
                setTimeout( () => {
                    // Отключаем анимацию
                    removeAnimation()

                    // Без анимации незаметно переключаемся на последний слайд
                    showSlideByIndex( slidesLength )
                    // Возвращаем анимацию, дав браузеру немного времени на перерендер без анимации на последний элемент
                    setTimeout( () => {
                        // Возвращаем анимацию
                        addAnimation()
                    }, DOM_RENDER_DELAY )
                }, TRANSITION_TIME )
            } else {
                showSlideByIndex( activeSlideIndex - 1 )
            }
        }

        const startAutoSliding = ( ms = 3000 ) => {
            if ( !autoSlidingInterval ) {
                autoSlidingInterval = setInterval( () => {
                    next()
                }, ms )
            }
        }

        const stopAutoSliding = ( ms = 5000 ) => {
            clearInterval( autoSlidingInterval )
        }

        // Начать анимацию при попадании слайдера в зону видимости
        const startAutoSlidingWhenVisible = ( firstSlideDelay ) => {
            const $slider = document.querySelector( '.de-slider' )

            const onSliderVisibilityChange = ( sliderElement ) => {
                // Слайдер попал в зону видимости
                if ( sliderElement[0]?.isIntersecting ) {
                    // Первое перелистывание после попадания в зону видимости ч/з 2s
                    // Дальше старт стандартного автоперелистывания с заданным интервалом
                    setTimeout( () => {
                        next() // первое перелистывание
                        startAutoSliding() // Запускаем автоперелистывание
                    }, firstSlideDelay )

                    // Больше не нужно слушать попадание в зону видимости
                    // Так как таймер на старт автоперелистывания уже запущен
                    observer.unobserve( $slider )
                }
            }

            // Слушаем изменения видимости слайдера
            let observer = new IntersectionObserver(
                onSliderVisibilityChange,
                {
                    rootMargin: '0px',
                    threshold: [0.5, 1]
                }
            );
            observer.observe( $slider )
        }

        // Listeners
        $sliderNext.addEventListener( 'click', () => { next() } )
        $sliderPrev.addEventListener( 'click', () => { prev() } )
        $slider.addEventListener( 'click', () => { stopAutoSliding() } )

        window.addEventListener( 'resize', () => {
            sliderWidth = $slider.clientWidth
            slidesLength = $sliderSlides.length
            sliderLineWidth = sliderWidth * slidesLength + sliderWidth * 2
            $sliderLine.style.width = `${ sliderLineWidth }px`
            showSlideByIndex( 0 )
        } )

        // API
        return {
            next,
            prev,
            startAutoSliding,
            stopAutoSliding,
            startAutoSlidingWhenVisible,
        }
    }

    window.createDeSlider = createDeSlider
} )()
