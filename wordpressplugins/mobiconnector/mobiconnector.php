<?php
/**
 * Plugin Name: Mobile Connector
 * Plugin URI: https://buy-addons.com/
 * Description: Intergrated to Wordpress Rest API
 * Version: 1.0.12
 * Author: buy-addons
 * Author URI: https://buy-addons.com
 * Requires at least: 2.0
 * Tested up to: 4.5
 * Compatibility with the REST API v2
 *
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
error_reporting(0);
class MobiConnector{
	
	public function __construct() {
		if (!extension_loaded('gd') && !function_exists('gd_info')) {
			add_action( 'admin_notices', array($this,'admin_notice_error') );
		}		
		require_once( 'includes/class.core.php' );
		require_once( 'includes/class-mobiconnector-install.php' );
		require_once( 'includes/class-mobiconnector-posts.php' );
		require_once( 'includes/class-mobiconnector-category.php' );
		require_once( 'includes/class-mobiconnector-comments.php' );
		require_once( 'includes/class-mobiconnector-users.php' );
		require_once( 'endpoints/class-mobiconnector-user.php' );
		require_once( 'endpoints/class-mobiconnector-post.php' );
		// cập nhật avatar
		require_once(ABSPATH.'wp-includes/pluggable.php' );
		require_once(ABSPATH.'wp-admin/includes/image.php' );
		
	}
	
	public function admin_notice_error(){		
		$class = 'notice notice-error is-dismissible';		
		$message = __( 'Your PHP have not installed the GD library . Please install the GD library to avoid some errors when using the REST API. ', 'woocommerce' );
		$link = __('Install GD library', 'woocommerce');		
		printf( '<div class="%1$s"><p>%2$s<a href="http://php.net/manual/en/image.installation.php">%3$s</a></p></div>', esc_attr( $class ), esc_html( $message ), esc_html($link));	
	}
	
}
$mobie = new MobiConnector();