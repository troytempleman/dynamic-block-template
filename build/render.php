<?php

// Attributes
$text_align = isset( $attributes['textAlign'] ) ? $attributes['textAlign'] : null;
$title = isset( $attributes['title'] ) ? $attributes['title'] : null;
$post_type = isset( $attributes['postType'] ) ? $attributes['postType'] : null;
$number_of_posts = isset( $attributes['numberOfPosts'] ) ? $attributes['numberOfPosts'] : null;

// Wrapper
$class = 'wp-block-tt-dynamic-block-template ';
$class .= $text_align ? ' has-text-align-' . $text_align : null;
$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $class ) );

// Query
$args = array(
	'post_type' => $post_type,
	'posts_per_page' => $number_of_posts,
	'orderby' => 'date',
	'order' => 'desc',
	'ignore_sticky_posts' => true,
	'no_found_rows' => true,
);
$query = new WP_Query( $args );

// Posts
$posts = '';
if ( $query->have_posts() ) {
	$posts .= '<ul class="wp-block-tt-dynamic-block-template-list">';
    while ( $query->have_posts() ) : $query->the_post();
		$the_title = get_the_title();
		$the_permalink = esc_url( get_permalink() );
		$posts .= '<li class="wp-block-tt-dynamic-block-template-list-item">';
		$posts .= '<a class="wp-block-tt-dynamic-block-template-list-item-link" href="' . $the_permalink . '">' . $the_title . '</a>';
		$posts .= '</li>';
    endwhile;
	$posts .= '</ul>';
} else {
    __( 'Not Found.', 'wp-block-tt-dynamic-block-template' );
}
wp_reset_postdata();

// Block content
$block_content = '<div ' . $wrapper_attributes . '>';
$block_content .= '<h2 class="wp-block-tt-dynamic-block-template-title">' . $title . '</h2>';
$block_content .= $posts;
$block_content .= '</div>';
echo $block_content;

?>
