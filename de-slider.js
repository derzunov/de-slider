( () => {
    const createDeSlider = ( sliderSelector = '.de-slider' ) => {

        // Elements
        const $slider = document.querySelector( sliderSelector )
        const $sliderLine = $slider.querySelector( '.de-slider__line' )
        const $sliderSlides = $sliderLine.querySelectorAll( '.de-slider__slide' )
        const $sliderNext = $slider.querySelector( '.de-slider__control_next' )
        const $sliderPrev = $slider.querySelector( '.de-slider__control_prev' )

        // Vars
        const sliderWidth = $slider.clientWidth
        const slidesLength = $sliderSlides.length
        const sliderLineWidth = sliderWidth * slidesLength
        let activeSlideIndex = 0

        $sliderLine.style.width = `${ sliderLineWidth }px`

        // Methods
        const showSlideByIndex = ( slideIndex ) => {
            $sliderLine.style.transform = `translateX(-${ slideIndex * sliderWidth }px)`
            activeSlideIndex = slideIndex
        }
        const next = () => {
            if ( activeSlideIndex >= slidesLength - 1 ) {
                showSlideByIndex( 0 )
            } else {
                showSlideByIndex( activeSlideIndex + 1 )
            }
        }
        const prev = () => {
            if ( activeSlideIndex <= 0 ) {
                showSlideByIndex( slidesLength - 1 )
            } else {
                showSlideByIndex( activeSlideIndex - 1 )
            }
        }

        let autoSlidingInterval = null
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
