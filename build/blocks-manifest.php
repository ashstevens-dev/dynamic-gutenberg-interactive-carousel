<?php
// This file is generated. Do not modify it manually.
return array(
	'interactive-carousel' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'interactive-carousel/interactive-carousel',
		'version' => '0.1.0',
		'title' => 'Interactive Carousel',
		'category' => 'media',
		'icon' => 'slides',
		'keywords' => array(
			'carousel',
			'slider',
			'gallery',
			'posts',
			'products'
		),
		'description' => 'Interactive carousel of latest posts or products filtered by category.',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'interactive-carousel',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'script' => 'file:./slider-component.js',
		'attributes' => array(
			'backgroundColor' => array(
				'type' => 'string'
			),
			'headingColor' => array(
				'type' => 'string'
			),
			'textColor' => array(
				'type' => 'string'
			),
			'selectedOption' => array(
				'type' => 'string',
				'default' => 'c2a-gallery'
			),
			'postsToShow' => array(
				'type' => 'integer',
				'default' => 4
			),
			'displayThumbnail' => array(
				'type' => 'boolean',
				'default' => true
			),
			'displayExcerpt' => array(
				'type' => 'boolean',
				'default' => true
			),
			'postType' => array(
				'type' => 'string',
				'default' => 'post'
			),
			'selectedProductCat' => array(
				'type' => 'integer',
				'default' => 19
			)
		)
	)
);
