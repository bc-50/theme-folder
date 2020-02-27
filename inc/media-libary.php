<?php
define('MY_POST_TYPE', 'image_libary');
define('MY_POST_SLUG', 'image_libary');

function image_libary_post_type_func() {
  // Slider Post Type
  register_post_type(MY_POST_TYPE, array(
    //Most of the visual stuff in labels array
      'labels' => array(
        'name' => 'Sliders',
        'add_new_item' => 'Add New Slider',
        'edit_item' => 'Edit Sliders',
        'all_items' => 'All Sliders',
        'singular_name' => 'Slider'
      ),
      'supports' => array('title', 'excerpt'),
      'register_meta_box_cb' => 'my_meta_box_cb',
      'public' => true,
      'menu_icon' => 'dashicons-images-alt2',
      'has_archive' => true,
      'map_meta_cap' => true,        //wordpress applies role permission when needed
      'query_var' => true,
      'show_in_rest' => true
    ));
  }

  add_action( 'init', 'image_libary_post_type_func' );

  function my_meta_box_cb () {
    add_meta_box( 'image_libary_images' , 'Media Library', 'my_meta_box_images', MY_POST_TYPE, 'normal', 'high' );
  
  }
  
  function my_meta_box_images () {
    global $post;
    $meta_key = 'image_libary_images';
    echo image_uploader_field( $meta_key, get_post_meta($post->ID, $meta_key) );
  }

  function myplugin_save_postdata( $id ) {
    if ( defined('DOING_AUTOSAVE') && DOING_AUTOSAVE )
    return $id;
    global $post;
    $meta_key = 'image_libary_images';
   
    
    $count = 1;
   if (isset($post) && !empty($_POST['image_libary_images'])) {
    if ('' !== get_post_meta($post->ID, $meta_key)) {
      $metas = explode(',',$_POST['image_libary_images']);
      update_post_meta( $id, $meta_key, $metas);
    }
   }
 
  return $id;
  }
  
  add_action('save_post', 'myplugin_save_postdata');


  function include_myuploadscript() {
    /*
     * I recommend to add additional conditions just to not to load the scipts on each page
     * like:
     * if ( !in_array('post-new.php','post.php') ) return;
     */
    if ( ! did_action( 'wp_enqueue_media' ) ) {
      wp_enqueue_media();
    }
    wp_deregister_script('jquery');
  wp_register_script('jquery', "https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.3.1.min.js", false, null);
  wp_enqueue_script('jquery');
    wp_enqueue_style('MyStyles', get_stylesheet_directory_uri() . '/backend-styles/admin-main.min.css');
   
    wp_enqueue_script( 'myuploadscript', get_stylesheet_directory_uri() . '/js/backend-js/scripts.min.js', array('jquery'));
  }
   
  add_action( 'admin_enqueue_scripts', 'include_myuploadscript' );
  
  function image_uploader_field( $name, $values = array()) {
    $image = ' button">Upload image';
    $image_size = 'full'; // it would be better to use thumbnail size here (150x150 or so)
    $display = 'none'; // display state ot the "Remove image" button
    $r = '<div class="gallery-wrapper">';
    if (!empty($values)) {
      foreach ($values[0] as $value) {
        if( $image_attributes = wp_get_attachment_image_src( $value, $image_size ) ) {
     
          // $image_attributes[0] - image URL
          // $image_attributes[1] - image width
          // $image_attributes[2] - image height
       
          $image = '<img src="' . $image_attributes[0] . '" style="max-width:95%;display:block;" />';
          $display = 'inline-block';
       
          $r .='
          <div class="admin-image-wrapper">
            '. $image .'
          </div>';
        } 
      }
    }
    $r .= '
            <div class="upload">Upload Image</div>
            </div>
          <a href="#" style="display: none;" class="remove_image_button">Remove All</a>';
    return $r;
  }