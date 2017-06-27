<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
if ( ! class_exists( 'WP_REST_Controller' ) ) {
	require_once(ABSPATH.'wp-content/plugins/rest-api/lib/endpoints/class-wp-rest-controller.php');
}
class MobiConnectorCategory extends  WP_REST_Controller{
		
	public function __construct() {
		
		$this->register_routes();
	}
	public function register_routes() {
		add_action( 'rest_api_init', array( $this, 'register_api_hooks'));
	}
	public function register_api_hooks() {
		
		// add to user object: mobiconnector_local_avatar : get avatar based https://wordpress.org/plugins/wp-user-avatar/screenshots/
		register_rest_field( 'category',
			'mobiconnector_avatar',
			array(
				'get_callback'    => array($this, 'get_avatar'),
				'update_callback' => null,
				'schema'          => null,
			)
		);
		register_rest_field( 'category',
			'mobiconnector_last_post',
			array(
				'get_callback'    => array($this, 'get_post_category'),
				'update_callback' => null,
				'schema'          => null,
			)
		);
	}
	/**
	 add avatar
	 */
	public function get_avatar( $object, $field_name, $request) {

		require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
		if(is_plugin_active('wpcustom-category-image/load.php') == false)
			return null;
		require_once(ABSPATH.'wp-content/plugins/wpcustom-category-image/WPCustomCategoryImage.php');
		$attr = array(
			'term_id' => $object['id'],
		);
		return WPCustomCategoryImage::get_category_image($attr, true);
		
	}
	
	public $thumnails = array(
		'mobiconnector_small' => array(
			'width' => 320,
			'height' => 240
		),
		'mobiconnector_medium' => array(
			'width' => 480,
			'height' => 360
		),
		'mobiconnector_large' => array(
			'width' => 752,
			'height' => 564
		),
		'mobiconnector_x_large' => array(
			'width' => 1080,
			'height' => 810
		),
	);	
	
	public function get_post_category($object, $field_name, $request){
		$id = $object['id'];
		$args = array(
			'posts_per_page'   => 1,
			'page'             => 1,
			'offset'           => 0,
			'category'         => $id,
			'category_name'    => '',
			'orderby'          => 'date',
			'order'            => 'DESC',
			'meta_key'         => '',
			'meta_value'       => '',
			'post_type'        => 'post',
			'post_mime_type'   => '',
			'post_parent'      => '',
			'author'	       => '',
			'author_name'	   => '',
			'post_status'      => 'publish',
			'suppress_filters' => true 
		);
		$result =  get_posts($args);
		if($result != null || !empty($result))
		{
			foreach($result as $post)
			{
				$daten = new DateTime($post->post_date);
				$date = $daten->format('Y-m-d\TH:i:s');	
				$dategmtn = new DateTime($post->post_date_gmt);
				$dategmt = $dategmtn->format('Y-m-d\TH:i:s');	
				$modin = new DateTime($post->post_modified);
				$modi = $modin->format('Y-m-d\TH:i:s');	
				$modigmtn = new DateTime($post->post_modified_gmt);
				$modigmt = $modigmtn->format('Y-m-d\TH:i:s');	
				$postcate['ID'] = $post->ID;
				$postcate['post_author'] = $post->post_author;
				$postcate['post_author_name'] = get_author_name($post->post_author);
				$postcate['post_date'] = $date;
				$postcate['post_date_gmt'] = $dategmt;
				$postcate['post_content'] = $post->post_content;
				$postcate['post_title'] = $post->post_title;
				$postcate['post_excerpt'] = $post->post_excerpt;
				$postcate['post_status'] = $post->post_status;
				$postcate['comment_status'] = $post->comment_status;
				$postcate['ping_status'] = $post->ping_status;
				$postcate['post_password'] = $post->post_password;
				$postcate['post_name'] = $post->post_name;
				$postcate['to_ping'] = $post->to_ping;
				$postcate['pinged'] = $post->pinged;
				$postcate['post_modified'] = $modi;
				$postcate['post_modified_gmt'] = $modigmt;
				$postcate['post_content_filtered'] = $post->post_content_filtered;
				$postcate['post_parent'] = $post->post_parent;
				$postcate['guid'] = $post->guid;
				$postcate['menu_order'] = $post->menu_order;
				$postcate['post_type'] = $post->post_type;
				$postcate['post_mime_type'] = $post->post_mime_type;
				$postcate['comment_count'] = $post->comment_count;
				$postcate['filter'] = $post->filter;
				$thumbnailId = get_post_thumbnail_id($post->ID);
				$postcate['source_url'] = wp_get_attachment_url( $thumbnailId );
				$wp_upload_dir = wp_upload_dir();		
				foreach($this->thumnails as $key => $value)
				{			
					$postmeta = get_post_meta($thumbnailId,$key,true);
					if(!empty($postmeta)){
						$postcate[$key] = $wp_upload_dir['baseurl']."/".$postmeta;					
					}
					else{
						$postcate[$key] = null;			
					}
				}
				$postcate['feature_image_small']= $postcate['mobiconnector_small'];
				$postcate['feature_image_medium'] = $postcate['mobiconnector_medium'];
				$postcate['feature_image_large'] = $postcate['mobiconnector_large'];
				$postcate['feature_image_x_large'] = $postcate['mobiconnector_x_large'];
				unset($postcate['mobiconnector_small']);
				unset($postcate['mobiconnector_medium']);
				unset($postcate['mobiconnector_large']);
				unset($postcate['mobiconnector_x_large']);
				return $postcate;
			}
		}
		else{
			return null;
		}
	}
	


}
$MobiConnectorCategory = new MobiConnectorCategory();
?>