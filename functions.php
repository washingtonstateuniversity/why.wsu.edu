<?php

class Why_WSU_Theme {

	/**
	 * @var string String used for busting cache on scripts.
	 *
	 * @since 0.0.1
	 */
	var $script_version = '0.0.7';

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

		add_action( 'wp_footer', array( $this, 'carnegie_tracking_tags' ), 101 );
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

	/**
	 * Inserts tracking tags used for retargeting with Carnegie Communications.
	 *
	 * @since 0.0.7
	 */
	public function carnegie_tracking_tags() {
		// @codingStandardsIgnoreStart
		?>
		<!-- Google Code for Remarketing Tag -->
		<!--------------------------------------------------
		Remarketing tags may not be associated with personally identifiable information or placed on pages related to sensitive categories. See more information and instructions on how to setup the tag on: http://google.com/ads/remarketingsetup
		--------------------------------------------------->
		<script type="text/javascript">
			/* <![CDATA[ */
			var google_conversion_id = 864713563;
			var google_custom_params = window.google_tag_params;
			var google_remarketing_only = true;
			/* ]]> */
		</script>
		<script type="text/javascript" src="https://www.googleadservices.com/pagead/conversion.js">
		</script>
		<noscript>
			<div style="display:inline;">
				<img height="1" width="1" style="border-style:none;" alt="" src="https://googleads.g.doubleclick.net/pagead/viewthroughconversion/864713563/?guid=ON&amp;script=0"/>
			</div>
		</noscript>
		<!-- Facebook Pixel Code -->
		<script>
			!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
				n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
				n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
				t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
				document,'script','https://connect.facebook.net/en_US/fbevents.js');
			fbq('init', '1283395071698859'); // Insert your pixel ID here.
			fbq('track', 'PageView');
		</script>
		<noscript><img height="1" width="1" style="display:none"
		               src="https://www.facebook.com/tr?id=1283395071698859&ev=PageView&noscript=1"
			/></noscript>
		<!-- DO NOT MODIFY -->
		<!-- End Facebook Pixel Code -->
		<?php
		// @codingStandardsIgnoreEnd
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
