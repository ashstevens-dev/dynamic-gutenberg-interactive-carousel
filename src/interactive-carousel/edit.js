/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	useBlockProps,
	BlockControls,
	InspectorControls,
	PanelColorSettings
} from '@wordpress/block-editor';

import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

import {
	PanelBody,
	PanelRow,
	RadioControl,
	RangeControl,
	ToggleControl,
	SelectControl
} from '@wordpress/components';

import {
	useRef,
	useState,
	useEffect,
	RawHTML
} from '@wordpress/element';

import { ReactComponent as ArrowSvg } from './assets/arrow.svg';
import { ReactComponent as LongArrowSvg } from './assets/long-arrow.svg';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

const postsPath = '/wp/v2/posts';
const productsPath = '/wc/v3/products';
const productCatsPath = '/wc/v3/products/categories';
const currencyPath = '/wc/v3/data/currencies/current';

function hexToRgb(hex) {
	const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function(m, r, g, b) {
		return r + r + g + g + b + b;
	});

	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);

	if (!result) {
		return null;
	}

	const r = parseInt(result[1], 16);
	const g = parseInt(result[2], 16);
	const b = parseInt(result[3], 16);

	return { r, g, b };
}

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { backgroundColor, headingColor, textColor, selectedOption, postsToShow, displayThumbnail, displayExcerpt, postType, selectedProductCat } = attributes;

	const rootBlockRef = useRef( null );
	const blockProps = useBlockProps( { ref: rootBlockRef, } );

	const updateSlider = new Event( 'slider-update', { bubbles: true, cancelable: false, composed: true } );

	const [ rgbBackgroundColor, setRgbBackgroundColor ] = useState( '255, 255, 255' );
	const [ rgbHeadingColor, setRgbHeadingColor ] = useState( '51, 51, 51' );
	const [ rgbTextColor, setRgbTextColor ] = useState( '51, 51, 51' );

	const onChangeBackgroundColor = ( newBackgroundColor ) => {
		setAttributes( { backgroundColor: newBackgroundColor } );

		let rgbBackgroundColorTemp = hexToRgb( newBackgroundColor );
		setRgbBackgroundColor( `${ rgbBackgroundColorTemp.r }, ${ rgbBackgroundColorTemp.g }, ${ rgbBackgroundColorTemp.b }` );
	};
	const onChangeHeadingColor = ( newHeadingColor ) => {
		setAttributes( { headingColor: newHeadingColor } );

		let rgbHeadingColorTemp = hexToRgb( newHeadingColor );
		setRgbHeadingColor( `${ rgbHeadingColorTemp.r }, ${ rgbHeadingColorTemp.g }, ${ rgbHeadingColorTemp.b }` );
	};
	const onChangeTextColor = ( newTextColor ) => {
		setAttributes( { textColor: newTextColor } );

		let rgbTextColorTemp = hexToRgb( newTextColor );
		setRgbTextColor( `${ rgbTextColorTemp.r }, ${ rgbTextColorTemp.g }, ${ rgbTextColorTemp.b }` );
	};
	const onChangeNewOption = ( newOption ) => {
		setAttributes( { selectedOption: newOption } );
		
		rootBlockRef.current.dispatchEvent( updateSlider );
	};
	const onChangePostsToShow = ( newPostsToShow ) => {
		setAttributes( { postsToShow: newPostsToShow } );
	};
	const onChangePostType = ( newPostType ) => {
		setAttributes( { postType: newPostType } );
		
		rootBlockRef.current.dispatchEvent( updateSlider );
	};
	const onChangeProductCat = ( newProductCat ) => {
		setAttributes( { selectedProductCat: Number( newProductCat ) } );
	};

	const [ posts, setPosts ] = useState([]);
	const [ products, setProducts ] = useState([]);
	const [ productCats, setProductCats ] = useState([]);
	const [ currency, setCurrency ] = useState([]);
	const [ isLoading, setIsLoading ] = useState( true );

	const postQueryParams = {
		per_page: postsToShow,
		status: 'publish',
		orderby: 'date',
		order: 'desc',
		_embed: true
	};

	const productQueryParams = {
		per_page: postsToShow,
		status: 'publish',
		category: selectedProductCat,
		_embed: true
	};

	const productCatsQueryParams = {
		hide_empty: true
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await apiFetch( { path: addQueryArgs( postsPath, postQueryParams ) } );
				setPosts( result );
				setIsLoading( false );
			} catch ( err ) {
				console.error( "Error fetching posts:", err );
				setIsLoading( false );
			}
		};

		fetchData();
	}, [ postsToShow, postType ]); 

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await apiFetch( { path: addQueryArgs( productsPath, productQueryParams ) } );
				setProducts( result );
				setIsLoading( false );
			} catch ( err ) {
				console.error( "Error fetching products:", err );
				setIsLoading( false );
			}
		};

		fetchData();
	}, [ postsToShow, selectedProductCat, postType ]);

	const updatePosts = new Event( 'posts-update', { bubbles: true, cancelable: false, composed: true } );
	const updateProducts = new Event( 'products-update', { bubbles: true, cancelable: false, composed: true } );
	
	useEffect(() => {
		if ( !isLoading && posts ) {
			rootBlockRef.current.dispatchEvent( updatePosts );
		}

		if ( !isLoading && products ) {
			rootBlockRef.current.dispatchEvent( updateProducts );
		}
	}, [ isLoading, posts, products ]);

	useEffect(() => {
		apiFetch( { path: addQueryArgs( productCatsPath, productCatsQueryParams ) } )
		.then( ( data ) => {
			setProductCats( data.map(( c ) => ({ label: c.name, value: c.id })) || [] );
		} )
		.catch( ( err ) => {
			console.error( "Error fetching product cats:", err );
		});
	}, []);  

	useEffect(() => {
		apiFetch( { path: currencyPath } )
		.then( ( data ) => {
			setCurrency( data || [] );
		} )
		.catch( ( err ) => {
			console.error( "Error fetching currency:", err );
		});
	}, []);

	return [
		<div
			{ ...blockProps }
			style={{ backgroundColor: backgroundColor }}
		>
			<InspectorControls>
				<PanelColorSettings 
					title={ __( 'Color settings', 'interactive-carousel' ) }
					initialOpen={ false }
					colorSettings={ [
						{
						  value: backgroundColor,
						  onChange: onChangeBackgroundColor,
						  label: __( 'Background color', 'interactive-carousel' )
						},
						{
						  value: headingColor,
						  onChange: onChangeHeadingColor,
						  label: __( 'Heading color', 'interactive-carousel' )
						},
						{
						  value: textColor,
						  onChange: onChangeTextColor,
						  label: __( 'Text color', 'interactive-carousel' )
						}
					] }
				/>
				<PanelBody
			    title={ __( 'Carousel Style', 'interactive-carousel' )}
			    initialOpen={ true }
				>
					<PanelRow>
						<fieldset>
							<RadioControl
						    label={ __( 'Select an Option', 'interactive-carousel' ) }
						    selected={ selectedOption }
						    options={ [
						    	{ label: __( 'C2A Gallery', 'interactive-carousel' ), value: 'c2a-gallery' },
						    	{ label: __( 'Caption Carousel', 'interactive-carousel' ), value: 'caption-carousel' },
						    	{ label: __( 'Interactive Carousel', 'interactive-carousel' ), value: 'carousel' },
						    ] }
						    onChange={ onChangeNewOption }
							/>
						</fieldset>
					</PanelRow>
				</PanelBody>
				<PanelBody
			    title={ __( 'Posts Settings', 'interactive-carousel' ) }
			    initialOpen={ true }
				>
				  <PanelRow>
						<RangeControl
						  label={ __( 'Number of Posts', 'interactive-carousel' ) }
						  value={ postsToShow }
						  onChange={ onChangePostsToShow }
						  min={ 4 }
						  max={ 10 }
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={ __( 'Show Featured Image', 'interactive-carousel' ) }
							checked={ displayThumbnail }
							onChange={ () =>
								setAttributes( { displayThumbnail: ! displayThumbnail } )
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={ __( 'Display Excerpt', 'interactive-carousel' ) }
							checked={ displayExcerpt }
							onChange={ () =>
								setAttributes( { displayExcerpt: ! displayExcerpt } )
							}
						/>
					</PanelRow>
					<PanelRow>
						<SelectControl
						  label={ __( 'Select Post Type', 'interactive-carousel' ) }
						  value={ postType }
						  options={ [
						  	{ label: __( 'Posts', 'interactive-carousel' ), value: 'post' },
						  	{ label: __( 'Products', 'interactive-carousel' ), value: 'product' }
						  ] }
						  onChange={ onChangePostType }
						/>
					</PanelRow>
					{ postType === 'product' ? (
			    	<PanelRow>
							<SelectControl
							  label={ __( 'Select Product Category', 'interactive-carousel' ) }
							  value={ selectedProductCat }
							  options={ productCats }
							  onChange={ onChangeProductCat }
							/>
						</PanelRow>
			    ) : '' }
			  </PanelBody>
			</InspectorControls>

			<slider-component
			  class={ `slider-mobile-gutter ${selectedOption}__slider` }
			  id={ `Slider-${ Math.floor( Math.random() * 100 ) }` }
			  style={{
			  	'--background-color': rgbBackgroundColor,
			  	'--heading-color': rgbHeadingColor,
			  	'--text-color': rgbTextColor
			  }}
			>
				<div
				  className={ `${selectedOption}__items slider slider--desktop` }
				  role='list'
				>
					{ postType === 'post' && posts && posts.map( ( post ) => {					
						return (
							<div
							  key={ post.id }
							  className={ `${selectedOption}__item slider__slide` }
				        role='listitem'
			  				id={ `Slide-${ post.id }` }
							>
							  {
									displayThumbnail && 
									post._embedded && 
									post._embedded[ 'wp:featuredmedia' ] &&
									post._embedded[ 'wp:featuredmedia' ][ 0 ] &&
									<img 
									  className='interactive-carousel__thumbnail'
										src={ post._embedded[ 'wp:featuredmedia' ][ 0 ].media_details.sizes.large.source_url }
										alt={ post._embedded[ 'wp:featuredmedia' ][ 0 ].alt_text }
									/>
								}
								<div className='interactive-carousel__inner-content'>
									<h3
										className='interactive-carousel__title'
									>
										<a href={ post.link } style={{ color: headingColor }}>
											{ post.title.rendered ? (
												<RawHTML>
													{ post.title.rendered }
												</RawHTML>
											) : (
												__( 'Default title', 'interactive-carousel' )
											)}
										</a>
									</h3>

									{ 
										displayExcerpt &&
										// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
										post.excerpt?.rendered && (
											<div className='interactive-carousel__excerpt' style={{ color: textColor }}>
												<RawHTML>
													{ post.excerpt.rendered }
												</RawHTML>
											</div>
										)
									}
								</div>
						  </div>
						);
					})}

					{ postType === 'product' && products && products.map( ( product ) => {					
						return (
							<div
							  key={ product.id }
							  className={ `${ selectedOption }__item slider__slide` }
				        role='listitem'
			  				id={ `Slide-${ product.id }` }
							>
								{
									displayThumbnail && 
									product.images[ 0 ] &&
									<img 
									  className='interactive-carousel__thumbnail'
										src={ product.images[ 0 ].src }
										alt={ product.images[ 0 ].alt }
									/>
								}

								<div className='interactive-carousel__inner-content'>
									<h3
										className='interactive-carousel__title'
									>
										<a href={ product.permalink } style={{ color: headingColor }}>
											{ product.name ? (
												<RawHTML>
													{ product.name }
												</RawHTML>
											) : (
												__( 'Default title', 'interactive-carousel' )
											)}
										</a>
									</h3>

									{ 
										displayExcerpt &&
										product.description && (
											<div className='interactive-carousel__excerpt' style={{ color: textColor }}>
												<RawHTML>
													{ product.description }
												</RawHTML>
											</div>
										)
									}

							    <div className='interactive-carousel__price' style={{ color: textColor }}>
							      { product.type == 'simple' && product.sale_price ? (
							      	<>
								      	<span className='interactive-carousel__price--regular interactive-carousel__price--regular-crossed'><RawHTML>{ currency.symbol }{ product.regular_price }</RawHTML></span>
								      	<span className='interactive-carousel__price--sale'><RawHTML>{ currency.symbol }{ product.sale_price }</RawHTML></span>
								      </>
								    ) : product.type == 'simple' && !product.sale_price ? (
								    	<>
								    	  <span className='interactive-carousel__price--regular'><RawHTML>{ currency.symbol }{ product.regular_price }</RawHTML></span>
								    	</>
								    ) : product.type == 'variable' && product.on_sale == true ? (
								    	<>
								    	  <span className='interactive-carousel__price--regular'><RawHTML>{ currency.symbol }{ product.price }+</RawHTML></span>
								    	</>
								    ) : (
								    	<>
								    	  <span className='interactive-carousel__price--regular'><RawHTML>{ currency.symbol }{ product.price }</RawHTML></span>
								    	</>
								    )}
							    </div>
						    </div>
						  </div>
						);
					})}
				</div>

				<div className="interactive-carousel__buttons">
					<button
				    type="button"
				    className="interactive-carousel__button interactive-carousel__button--prev"
				    name="previous"
				    aria-label="Previous Slide"
				  >
				    { selectedOption === 'caption-carousel' ? (
				    	<LongArrowSvg />
				    ) : (
				    	<ArrowSvg />
				    ) }
				  </button>
				  <div className="interactive-carousel__counter">
				    <span
				      className="interactive-carousel__counter--current"
				    >
					    1
					</span>
				    { selectedOption === 'carousel' ? (
				    	<nav className="interactive-carousel__dots-navigation"></nav>
				    ) : (
				    	<span>of</span>
				    ) }
				    <span className={ `interactive-carousel__counter--total${ selectedOption === 'carousel' ? ' visually-hidden' : '' }` }>
				      { postsToShow }
				    </span>
				  </div>
				  <button
				    type="button"
				    className="interactive-carousel__button interactive-carousel__button--next"
				    name="next"
				    aria-label="Next Slide"
				  >
				    { selectedOption === 'caption-carousel' ? (
				    	<LongArrowSvg />
				    ) : (
				    	<ArrowSvg />
				    ) }
				  </button>
				</div>
			</slider-component>
		</div>
	];
}