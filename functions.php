<?php

class Why_WSU_Theme {

	/**
	 * @var string String used for busting cache on scripts.
	 *
	 * @since 0.0.1
	 */
	var $script_version = '0.0.6';

	/**
	 * @var Why_WSU_Theme
	 *
	 * @since 0.0.1
	 */
	private static $instance;

	/**
	 * Maintain and return the one instance and initiate hooks when called the first time.
	 *
	 * @since 0.0.1
	 *
	 * @return \Why_WSU_Theme
	 */
	public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new Why_WSU_Theme;
			self::$instance->setup_hooks();
		}
		return self::$instance;
	}

	/**
	 * Setup hooks to include.
	 *
	 * @since 0.0.1
	 */
	public function setup_hooks() {
		add_filter( 'spine_child_theme_version', array( $this, 'theme_version' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ), 20 );

		remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
		remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
		remove_action( 'wp_print_styles', 'print_emoji_styles' );
		remove_action( 'admin_print_styles', 'print_emoji_styles' );
		add_filter( 'wp_resource_hints', array( $this, 'remove_s_w_org_dns_prefetch' ), 10, 2 );
	}

	/**
	 * Provide a theme version for use in cache busting.
	 *
	 * @since 0.0.1
	 *
	 * @return string
	 */
	public function theme_version() {
		return $this->script_version;
	}

	/**
	 * Enqueue the scripts used in the theme.
	 *
	 * @since 0.0.1
	 */
	public function enqueue_scripts() {
		wp_enqueue_script( 'why', get_stylesheet_directory_uri() . '/js/scripts.min.js', array( 'jquery', 'wsuwp-youtube-embed' ), $this->script_version, true );
		wp_dequeue_script( 'wsu-spine' );
	}

	/**
	 * Removes the s.w.org DNS prefetch.
	 *
	 * Code in this method is originally from GPL licensed https://wordpress.org/plugins/disable-emojis/
	 *
	 * @since 0.0.1
	 *
	 * @param  array  $urls          URLs to print for resource hints.
	 * @param  string $relation_type The relation type the URLs are printed for.
	 * @return array                 Difference between the two arrays.
	 */
	public function remove_s_w_org_dns_prefetch( $urls, $relation_type ) {
		if ( 'dns-prefetch' === $relation_type ) {
			/** This filter is documented in wp-includes/formatting.php */
			$emoji_svg_url = apply_filters( 'emoji_svg_url', 'https://s.w.org/images/core/emoji/2/svg/' );
			$urls = array_diff( $urls, array( $emoji_svg_url ) );
		}
		return $urls;
	}
}

add_action( 'after_setup_theme', 'Why_WSU_Theme' );
/**
 * Start things up.
 *
 * @return \Why_WSU_Theme
 */
function Why_WSU_Theme() {
	return Why_WSU_Theme::get_instance();
}
