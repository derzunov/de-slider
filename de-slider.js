( () => {
    const createDeSlider = ( sliderSelector = '.de-slider' ) => {

        // Constants
        const TRANSITION_TIME = 900; // ms
        const DOM_RENDER_DELAY = 20; // ms
        // Elements
        const $slider = document.querySelector( sliderSelector )
        const $sliderLine = $slider.querySelector( '.de-slider__line' )
        const $sliderSlides = $sliderLine.querySelectorAll( '.de-slider__slide' )
        const $sliderNext = $slider.querySelector( '.de-slider__control_next' )
        const $sliderPrev = $slider.querySelector( '.de-slider__control_prev' )

        // Vars
        const sliderWidth = $slider.clientWidth
        const slidesLength = $sliderSlides.length
        const sliderLineWidth = sliderWidth * slidesLength + sliderWidth * 2
        let autoSlidingInterval = null
        let activeSlideIndex = 1

        // Private methods
        const addAnimation = () => {
            $sliderLine.style.transition = `transform ${ TRANSITION_TIME }ms ease-in-out`
        }

        const removeAnimation = () => {
            $sliderLine.style.transition = 'none'
        }

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
            autoSlidingInterval = setInterval( () => {
                next()
            }, ms )
        }

        const stopAutoSliding = ( ms = 3000 ) => {
            clearInterval(autoSlidingInterval)
        }

        // Listeners
        $sliderNext.addEventListener( 'click', () => { next() } )
        $sliderPrev.addEventListener( 'click', () => { prev() } )

        // API
        return {
            next,
            prev,
            startAutoSliding,
            stopAutoSliding,
        }
    }

    window.createDeSlider = createDeSlider
} )()
