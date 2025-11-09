<?php
	
	if (isset($attributes[ 'backgroundColor' ])) {
		$rgb_background_color_temp = hexToRgbPhp($attributes[ 'backgroundColor' ]);
		$rgb_background_color = "{$rgb_background_color_temp['r']}, {$rgb_background_color_temp['g']}, {$rgb_background_color_temp['b']}";
	} else {
		$rgb_background_color = '255, 255, 255';
	}

	if (isset($attributes[ 'headingColor' ])) {
		$rgb_heading_color_temp = hexToRgbPhp($attributes[ 'headingColor' ]);
		$rgb_heading_color = "{$rgb_heading_color_temp['r']}, {$rgb_heading_color_temp['g']}, {$rgb_heading_color_temp['b']}";
	} else {
		$rgb_heading_color = '51, 51, 51';
	}

	if (isset($attributes[ 'textColor' ])) {
		$rgb_text_color_temp = hexToRgbPhp($attributes[ 'textColor' ]);
		$rgb_text_color = "{$rgb_text_color_temp['r']}, {$rgb_text_color_temp['g']}, {$rgb_text_color_temp['b']}";
	} else {
		$rgb_text_color = '51, 51, 51';
	}

	$currency_symbol = get_woocommerce_currency_symbol();
	
	$latest_posts_args = array(
		'numberposts' => $attributes[ 'postsToShow' ],
		'post_status' => 'publish',
		'orderby' => 'date',
		'order' => 'DESC',
		'_embed' => true,
	);
	$latest_posts = get_posts( $latest_posts_args );

	$products_args = array(
		'post_type' => 'product',
		'numberposts' => $attributes[ 'postsToShow' ],
		'post_status' => 'publish',
		'tax_query' => array(
			array(
				'taxonomy' => 'product_cat',
				'terms' => $attributes[ 'selectedProductCat' ],
				'field' => 'id',
			),
		),
		'_embed' => true,
	);
	$products = get_posts( $products_args );
?>

<div
  <?php echo get_block_wrapper_attributes(); ?>
  style="background-color: <?php echo "rgb($rgb_background_color)"; ?>;"
>
	<slider-component
	  class="slider-mobile-gutter <?php echo $attributes[ 'selectedOption' ]; ?>__slider"
	  id="Slider-<?php echo random_int( 0, 99 ); ?>"
	  style="--background-color: <?php echo $rgb_background_color; ?>;--heading-color: <?php echo $rgb_heading_color; ?>;--text-color: <?php echo $rgb_text_color; ?>;"
	>
		<div
		  class="<?php echo $attributes[ 'selectedOption' ]; ?>__items slider slider--desktop"
		  role="list"
		>
			<?php if ( ! empty( $latest_posts ) && $attributes[ 'postType' ] == 'post' ) { ?>
		    <?php foreach ( $latest_posts as $post ) { ?>
	    		<div 
		    	  class="<?php echo $attributes[ 'selectedOption' ]; ?>__item slider__slide"
		    	  role="listitem"
		    	  id="Slide-<?php echo $post->ID; ?>"
		    	>
		    		<?php
		    		  $title = $post->post_title ? $post->post_title : 'Default title';
				    	$thumbnail = has_post_thumbnail( $post->ID ) ? get_the_post_thumbnail( $post->ID, 'large', array( 'class' => 'interactive-carousel__thumbnail' ) ) : '';

				    	if( ! empty( $thumbnail ) && $attributes[ 'displayThumbnail' ] ){
								echo $thumbnail;
							}
						?>

						<div class="interactive-carousel__inner-content">
			        <h3 class="interactive-carousel__title">
			        	<a
			        	  href="<?php the_permalink(); ?>"
			        	  style="color: <?php echo "rgb($rgb_heading_color)"; ?>;"
								>
			        		<?php echo $title ?>
			        	</a>
			        </h3>

			        <?php if( $attributes[ 'displayExcerpt' ] ) { ?>
				        <div
				          class="interactive-carousel__excerpt"
				          style="color: <?php echo "rgb($rgb_text_color)"; ?>;"
				        >
				        	<?php echo get_the_excerpt( $post->ID ); ?>
				        </div>
				      <?php } ?>
			      </div>
				  </div>
			  <?php } ?>

			<?php } else if ( ! empty( $products ) && $attributes[ 'postType' ] == 'product' ) { ?>
				<?php foreach ( $products as $product ) { ?>
					<div 
		    	  class="<?php echo $attributes[ 'selectedOption' ]; ?>__item slider__slide"
		    	  role="listitem"
		    	  id="Slide-<?php echo $product->ID; ?>"
		    	>
		    		<?php
		    		  $title = $product->post_title ? $product->post_title : 'Default title';
				    	$thumbnail = has_post_thumbnail( $product->ID ) ? get_the_post_thumbnail( $product->ID, 'large', array( 'class' => 'interactive-carousel__thumbnail' ) ) : '';
				    	$item = wc_get_product( $product->ID );
				    	$active_price  = $item->get_price();
              $regular_price = $item->get_regular_price();

				    	if( ! empty( $thumbnail ) && $attributes[ 'displayThumbnail' ] ){
								echo $thumbnail;
							}
						?>

						<div class="interactive-carousel__inner-content">
			        <h3 class="interactive-carousel__title">
			        	<a
			        	  href="<?php the_permalink(); ?>"
			        	  style="color: <?php echo "rgb($rgb_heading_color)"; ?>;"
								>
			        		<?php echo $title ?>
			        	</a>
			        </h3>

			        <?php if( $attributes[ 'displayExcerpt' ] ) { ?>
				        <div
				          class="interactive-carousel__excerpt"
				          style="color: <?php echo "rgb($rgb_text_color)"; ?>;"
				        >
				        	<?php echo get_the_excerpt( $post->ID ); ?>
				        </div>
				      <?php } ?>

			        <div
			          class="interactive-carousel__price"
			          style="color: <?php echo "rgb($rgb_text_color)"; ?>;"
			        >
			        	<?php if ( $item->is_type( 'simple' ) && $item->is_on_sale() ) : ?>
			        		<span class='interactive-carousel__price--regular interactive-carousel__price--regular-crossed'>
				        		<?php echo "$currency_symbol$regular_price"; ?>
				        	</span>
							    <span class='interactive-carousel__price--sale'>
								    <?php echo "$currency_symbol$active_price"; ?>
								  </span>
			        	<?php elseif ( $item->is_type( 'simple' ) && !$item->is_on_sale() ) : ?>
			        		<span class='interactive-carousel__price--regular'>
			        			<?php echo "$currency_symbol$regular_price"; ?>
			        		</span>
			        	<?php elseif ( $item->is_type( 'variable' ) && $item->is_on_sale() ) : ?>
			        		<span class='interactive-carousel__price--regular'>
			        			<?php echo "$currency_symbol$active_price+"; ?>
			        		</span>
			        	<?php else : ?>
			        		<span class='interactive-carousel__price--regular'>
			        			<?php echo "$currency_symbol$regular_price"; ?>
			        		</span>
			        	<?php endif; ?>
			        </div>
					  </div>
					</div>
				<?php } ?>

			<?php } else { ?>
				<strong>Sorry. No posts matching your criteria!</strong>
			<?php } ?>
		</div>

		<div class="interactive-carousel__buttons">
			<button
	      type="button"
	      class="interactive-carousel__button interactive-carousel__button--prev"
	      name="previous"
	      aria-label="<?php echo esc_attr__( 'Previous Slide', 'interactive-carousel' ); ?>"
	    >
	    	<?php
	    	  echo $attributes[ 'selectedOption' ] == 'caption-carousel' ?
	    	  file_get_contents( plugin_dir_url( __FILE__ ) . '/assets/long-arrow.svg' )
	    	  :
	    	  file_get_contents( plugin_dir_url( __FILE__ ) . '/assets/arrow.svg' );
	    	?>
	    </button>
	    <div class="interactive-carousel__counter">
	    	<span class="interactive-carousel__counter--current">1</span>
		        <?php if ( $attributes[ 'selectedOption' ] == 'carousel' ) { ?>
		    	<nav class="interactive-carousel__dots-navigation"></nav>
		    	<?php } else { ?>
		    	<span>of</span>
		    	<?php } ?>
		    <span class="interactive-carousel__counter--total<?php echo $attributes[ 'selectedOption' ] == 'carousel' ? ' visually-hidden' : ''; ?>">
		      <?php echo $attributes[ 'postsToShow' ]; ?>
		    </span>
	    </div>
	    <button
	      type="button"
	      class="interactive-carousel__button interactive-carousel__button--next"
	      name="next"
	      aria-label="<?php echo esc_attr__( 'Next Slide', 'interactive-carousel' ); ?>"
	    >
	      <?php
	    	  echo $attributes[ 'selectedOption' ] == 'caption-carousel' ?
	    	  file_get_contents( plugin_dir_url( __FILE__ ) . '/assets/long-arrow.svg' )
	    	  :
	    	  file_get_contents( plugin_dir_url( __FILE__ ) . '/assets/arrow.svg' );
	    	?>
	    </button>
		</div>
	</slider-component>
</div>