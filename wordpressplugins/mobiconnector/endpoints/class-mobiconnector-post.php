<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
if ( ! class_exists( 'WP_REST_Controller' ) ) {
	require_once(ABSPATH.'wp-content/plugins/rest-api/lib/endpoints/class-wp-rest-controller.php');
}
class MobiConnectorPost extends  WP_REST_Controller{
	private $rest_url = 'mobiconnector/post';	
	public function __construct() {
		
		$this->register_routes();
	}
	public function register_routes() {
		add_action( 'rest_api_init', array( $this, 'register_api_hooks'));
	}
	public function register_api_hooks() {
		
		// register users
		register_rest_route( $this->rest_url, '/counter_view', array(
				array(
					'methods'         => 'GET',
					'callback'        => array( $this, 'counter_view' ),
					'args' => array(
						'post_id' => array(
							'required' => true,
							'sanitize_callback' => 'absint'
						)
						
					),
				)
			) 
		);
		// lấy bài biết đọc nhiều nhất với query: wp-json/wp/v2/posts?filter[orderby]=post_views&filter[order]=asc
		
		/*22-3-2017 Code by Nguyen Hong Linh*/
		// Lay 3 bai viet theo category
		register_rest_route( $this->rest_url, '/getpostcategory', array(
			'methods' => 'GET',
			'callback' => array( $this, 'get_post_by_category' ),
			'args'            => array(
				'post_per_page' => array(
					'default' => 3,
					'sanitize_callback' => 'absint',
				),
				'post_num_page' => array(
					'default' => 1,
					'sanitize_callback' => 'absint',
				),
				'post_order_page' => array(
					'default' => 'DESC',
					'validate_callback' => array($this,'validate_post_order_page'),
				),
				'post_order_by' => array(
					'default' => 'date',
					'validate_callback' => array ($this,'validate_post_order_by'),
				),
				'post_category' => array(
					'sanitize_callback' => 'absint',
				),
			),
		) );
		// Lay 3 bai viet theo category theo wp-json/mobiconnector/post/getpostcategory
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
	public function counter_view( $request ) {
		require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
		if ( !is_plugin_active( 'post-views-counter/post-views-counter.php' ) ) {
		  return new WP_Error( 'post-views-counter_deactive', __( 'Post Views Counter Deactive' ), array( 'status' => 400 ) );
		}
		// require plugin
		require_once( ABSPATH . 'wp-content/plugins/post-views-counter/includes/functions.php' );
		$parameters = $request->get_params();
		pvc_view_post($parameters["post_id"]); // update post view
		return pvc_get_post_views($parameters["post_id"]); // get view of Post
	}
	
	/*22/3/2017 Code by Nguyen Hong Linh*/
	// Lay 3 bai viet moi nhat theo category
	public function get_post_by_category($request){
		$parameters = $request->get_params();
		$post_per_page = $parameters['post_per_page'];
		$post_num_page = $parameters['post_num_page'];
		$post_order_page = $parameters['post_order_page'];
		$post_order_by = $parameters['post_order_by'];
		include_once( ABSPATH . 'wp-admin/includes/plugin.php' ); 
		//var_dump(is_plugin_active('post-views-counter/post-views-counter.php'));die;
		if(is_plugin_active('post-views-counter/post-views-counter.php') == false)
			return 0;
					
		global $wpdb;
		$args = array(
			'orderby' => 'id',
			'hide_empty'=> 0,
		);
		
		$categories = get_categories($args);
		$result = "";
		$wp_upload_dir = wp_upload_dir();
		if(isset($parameters['post_category'])){
			$post_category = $parameters['post_category'];
			foreach($categories as $c)
			{			
				$args = array(
					'posts_per_page'   => $post_per_page,
					'page'             => $post_num_page,
					'offset'           => 0,
					'category'         => $post_category,
					'category_name'    => '',
					'orderby'          => $post_order_by,
					'order'            => $post_order_page,
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
				$postitems = get_posts($args);
				$list = array();
				foreach($postitems as $postitem)
				{	
					$daten = new DateTime($postitem->post_date);
					$date = $daten->format('Y-m-d\TH:i:s');	
					$dategmtn = new DateTime($postitem->post_date_gmt);
					$dategmt = $dategmtn->format('Y-m-d\TH:i:s');	
					$modin = new DateTime($postitem->post_modified);
					$modi = $modin->format('Y-m-d\TH:i:s');	
					$modigmtn = new DateTime($postitem->post_modified_gmt);
					$modigmt = $modigmtn->format('Y-m-d\TH:i:s');	
					$comments=(array) wp_count_comments( $postitem->ID);
					// chuyen thanh số nguyên
					//if(!empty($comments)) {
						//foreach($comments as &$item) {
						//	$item = absint($item);
						//}
					//}	
					// get total post views
					$count = $wpdb->get_var(
						$wpdb->prepare( "
							SELECT count
							FROM " . $wpdb->prefix . "post_views
							WHERE id = %d AND type = 4", absint( $postitem->ID )
						)
					);
					$thumbnailId = get_post_thumbnail_id($postitem->ID);
					foreach($this->thumnails as $key => $value)
					{			
						$listimages = get_post_meta($thumbnailId,$key,true);
						if(!empty($listimages)){
							$listimages[$key] = $wp_upload_dir['baseurl']."/".$listimages;					
						}
						else{
							$listimages[$key] = null;			
						}
					}
					$listimages['feature_image_small']= $listimages['mobiconnector_small'];
					$listimages['feature_image_medium'] = $listimages['mobiconnector_medium'];
					$listimages['feature_image_large'] = $listimages['mobiconnector_large'];
					$listimages['feature_image_x_large'] = $listimages['mobiconnector_x_large'];
					unset($listimages['mobiconnector_small']);
					unset($listimages['mobiconnector_medium']);
					unset($listimages['mobiconnector_large']);
					unset($listimages['mobiconnector_x_large']);
					$list[] = array(
						'post_id' => $postitem->ID,
						'post_author' => $postitem->post_author,
						'post_date' => $date,
						'post_date_gmt' => $dategmt,
						'post_content' => $postitem->post_content,
						'post_title' => $postitem->post_title,
						'post_excerpt' => $postitem->post_excerpt,
						'post_status' => $postitem->post_status,
						'comment_status' => $postitem->comment_status,	
						'ping_status' => $postitem->ping_status,
						'post_password' => $postitem->post_password,
						'post_name' => $postitem->post_name,
						'to_ping' => $postitem->to_ping,
						'pinged' => $postitem->pinged,
						'post_modified' => $modi,
						'post_modified_gmt' => $modigmt,
						'post_content_filtered' => $postitem->post_content_filtered,
						'post_parent' => $postitem->post_parent,
						'guid' => $postitem->guid,
						'menu_order' => $postitem->menu_order,
						'post_type' => $postitem->post_type,
						'post_mime_type' => $postitem->post_mime_type,
						'comment_count' => $postitem->comment_count,
						'filter' => $postitem->filter,					
						'images_link' => $listimages,
						'mobiconnector_total_comments' => $comments,
						'mobiconnector_total_views' => $count,
						'mobiconnector_format' => get_post_format($postitem->ID)? : 'standard',
					);
				}
				$result[] = array( 'name' => $c->name, 'term_id' => $c->term_id  ,'object' => $list);		
			}
		}
		else{
			foreach($categories as $c)
			{			
				$args = array(
					'posts_per_page'   => $post_per_page,
					'page'             => $post_num_page,
					'offset'           => 0,
					'category'         => $c->term_id,
					'category_name'    => '',
					'orderby'          => $post_order_by,
					'order'            => $post_order_page,
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
				$postitems = get_posts($args);
				$list = array();
				foreach($postitems as $postitem)
				{
					$daten = new DateTime($postitem->post_date);
					$date = $daten->format('Y-m-d\TH:i:s');	
					$dategmtn = new DateTime($postitem->post_date_gmt);
					$dategmt = $dategmtn->format('Y-m-d\TH:i:s');
					$modin = new DateTime($postitem->post_modified);
					$modi = $modin->format('Y-m-d\TH:i:s');	
					$modigmtn = new DateTime($postitem->post_modified_gmt);
					$modigmt = $modigmtn->format('Y-m-d\TH:i:s');	
					$comments=(array) wp_count_comments( $postitem->ID);
					// chuyen thanh số nguyên
					//if(!empty($comments)) {
						//foreach($comments as &$item) {
							//$item = absint($item);
						//}
					//}
					// get total post views
					$count = $wpdb->get_var(
						$wpdb->prepare( "
							SELECT count
							FROM " . $wpdb->prefix . "post_views
							WHERE id = %d AND type = 4", absint( $postitem->ID )
						)
					);

					$thumbnailId = get_post_thumbnail_id($postitem->ID);
					foreach($this->thumnails as $key => $value)
					{			
						$images = get_post_meta($thumbnailId,$key,true);
						if(!empty($images)){
							$listimages[$key] = $wp_upload_dir['baseurl']."/".$images;					
						}
						else{
							$listimages[$key] = null;			
						}
					}
					$listimages['feature_image_small']= $listimages['mobiconnector_small'];
					$listimages['feature_image_medium'] = $listimages['mobiconnector_medium'];
					$listimages['feature_image_large'] = $listimages['mobiconnector_large'];
					$listimages['feature_image_x_large'] = $listimages['mobiconnector_x_large'];
					unset($listimages['mobiconnector_small']);
					unset($listimages['mobiconnector_medium']);
					unset($listimages['mobiconnector_large']);
					unset($listimages['mobiconnector_x_large']);
					$list[] = array(
						'post_id' => $postitem->ID,
						'post_author' => $postitem->post_author,
						'post_date' => $date,
						'post_date_gmt' => $dategmt,
						'post_content' => $postitem->post_content,
						'post_title' => $postitem->post_title,
						'post_excerpt' => $postitem->post_excerpt,
						'post_status' => $postitem->post_status,
						'comment_status' => $postitem->comment_status,	
						'ping_status' => $postitem->ping_status,
						'post_password' => $postitem->post_password,
						'post_name' => $postitem->post_name,
						'to_ping' => $postitem->to_ping,
						'pinged' => $postitem->pinged,
						'post_modified' => $modi,
						'post_modified_gmt' => $modigmt,
						'post_content_filtered' => $postitem->post_content_filtered,
						'post_parent' => $postitem->post_parent,
						'guid' => $postitem->guid,
						'menu_order' => $postitem->menu_order,
						'post_type' => $postitem->post_type,
						'post_mime_type' => $postitem->post_mime_type,
						'comment_count' => $postitem->comment_count,
						'filter' => $postitem->filter,					
						'images_link' => $listimages,
						'mobiconnector_comments' => $comments,
						'mobiconnector_total_views' => $count,
						'mobiconnector_format' => get_post_format($postitem->ID)? : 'standard',
					);
				}
				$result[] = array( 'name' => $c->name, 'term_id' => $c->term_id, 'object' => $list);		
			}
		}
		return $result;
	}
	function validate_post_order_by($param, $request, $key) {
		$parameters = $request->get_params();
		if($parameters['post_order_by'] == 'ID' || $parameters['post_order_by'] == 'author' 
		|| $parameters['post_order_by'] == 'title' || $parameters['post_order_by'] == 'date' 
		|| $parameters['post_order_by'] == 'modified' || $parameters['post_order_by'] == 'parent' 
		|| $parameters['post_order_by'] == 'rand' || $parameters['post_order_by'] == 'comment_count' 
		|| $parameters['post_order_by'] == 'menu_order' || $parameters['post_order_by'] == 'meta_value' 
		|| $parameters['post_order_by'] == 'meta_value_num' || $parameters['post_order_by'] == 'post__in') 
		{
			return $parameters['post_order_by'];
		}
		else{
			return 'date';
		}
	}
	function validate_post_order_page($param, $request, $key){
		$parameters = $request->get_params();
		if($parameters['post_order_page'] == 'DESC' || $parameters['post_order_page'] == 'ASC')
		{
			return $parameters['post_order_page'];
		}
		else{
			return 'DESC';
		}
	}
	// ket thuc
}
$MobiConnectorPost = new MobiConnectorPost();
?>