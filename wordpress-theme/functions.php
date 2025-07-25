<?php
// Previne acesso direto
if (!defined('ABSPATH')) {
    exit;
}

// Configurações do tema
function idade_fala_setup() {
    // Suporte a título dinâmico
    add_theme_support('title-tag');
    
    // Suporte a imagens destacadas
    add_theme_support('post-thumbnails');
    
    // Suporte a menus
    add_theme_support('menus');
    
    // Registra menu principal
    register_nav_menus(array(
        'primary' => 'Menu Principal'
    ));
    
    // Suporte a HTML5
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption'
    ));
    
    // Suporte a feed automático
    add_theme_support('automatic-feed-links');
}
add_action('after_setup_theme', 'idade_fala_setup');

// Enfileirar estilos e scripts
function idade_fala_scripts() {
    // CSS principal
    wp_enqueue_style('idade-fala-style', get_stylesheet_uri(), array(), '1.0');
    
    // JavaScript (se necessário)
    wp_enqueue_script('idade-fala-script', get_template_directory_uri() . '/js/main.js', array('jquery'), '1.0', true);
}
add_action('wp_enqueue_scripts', 'idade_fala_scripts');

// Registrar áreas de widgets
function idade_fala_widgets_init() {
    register_sidebar(array(
        'name' => 'Sidebar Principal',
        'id' => 'sidebar-1',
        'description' => 'Área de widgets da sidebar principal',
        'before_widget' => '<div class="widget card">',
        'after_widget' => '</div>',
        'before_title' => '<h3 class="card-title">',
        'after_title' => '</h3>',
    ));
    
    register_sidebar(array(
        'name' => 'Footer',
        'id' => 'footer-1',
        'description' => 'Área de widgets do rodapé',
        'before_widget' => '<div class="footer-widget">',
        'after_widget' => '</div>',
        'before_title' => '<h4>',
        'after_title' => '</h4>',
    ));
}
add_action('widgets_init', 'idade_fala_widgets_init');

// Limitar excerpt
function idade_fala_excerpt_length($length) {
    return 30;
}
add_filter('excerpt_length', 'idade_fala_excerpt_length');

// Personalizar "Leia mais"
function idade_fala_excerpt_more($more) {
    return '...';
}
add_filter('excerpt_more', 'idade_fala_excerpt_more');

// Adicionar classe ao body para páginas específicas
function idade_fala_body_classes($classes) {
    if (is_page('avaliacao')) {
        $classes[] = 'page-avaliacao';
    }
    if (is_home() || is_front_page()) {
        $classes[] = 'home-page';
    }
    return $classes;
}
add_filter('body_class', 'idade_fala_body_classes');

// Remover versão do WordPress do head
function idade_fala_remove_version() {
    return '';
}
add_filter('the_generator', 'idade_fala_remove_version');

// Customizar login
function idade_fala_login_styles() {
    wp_enqueue_style('custom-login', get_template_directory_uri() . '/login-style.css');
}
add_action('login_enqueue_scripts', 'idade_fala_login_styles');

// Shortcode para botão personalizado
function idade_fala_button_shortcode($atts, $content = null) {
    $atts = shortcode_atts(array(
        'url' => '#',
        'style' => 'primary',
        'target' => '_self'
    ), $atts);
    
    $class = ($atts['style'] == 'secondary') ? 'btn btn-secondary' : 'btn';
    
    return '<a href="' . esc_url($atts['url']) . '" class="' . $class . '" target="' . esc_attr($atts['target']) . '">' . esc_html($content) . '</a>';
}
add_shortcode('botao', 'idade_fala_button_shortcode');

// Shortcode para card
function idade_fala_card_shortcode($atts, $content = null) {
    $atts = shortcode_atts(array(
        'titulo' => ''
    ), $atts);
    
    $output = '<div class="card">';
    if (!empty($atts['titulo'])) {
        $output .= '<h3 class="card-title">' . esc_html($atts['titulo']) . '</h3>';
    }
    $output .= '<div>' . do_shortcode($content) . '</div>';
    $output .= '</div>';
    
    return $output;
}
add_shortcode('card', 'idade_fala_card_shortcode');

// Função para posts relacionados
function idade_fala_related_posts($post_id = null) {
    if (!$post_id) {
        global $post;
        $post_id = $post->ID;
    }
    
    $categories = wp_get_post_categories($post_id);
    
    if ($categories) {
        $args = array(
            'category__in' => $categories,
            'post__not_in' => array($post_id),
            'posts_per_page' => 3,
            'orderby' => 'rand'
        );
        
        $related_posts = new WP_Query($args);
        
        if ($related_posts->have_posts()) {
            echo '<div class="related-posts">';
            echo '<h3>Posts Relacionados</h3>';
            echo '<div class="related-posts-grid">';
            
            while ($related_posts->have_posts()) {
                $related_posts->the_post();
                echo '<div class="card">';
                echo '<h4><a href="' . get_permalink() . '">' . get_the_title() . '</a></h4>';
                echo '<p>' . get_the_excerpt() . '</p>';
                echo '</div>';
            }
            
            echo '</div>';
            echo '</div>';
        }
        
        wp_reset_postdata();
    }
}

// Adicionar meta tags personalizadas
function idade_fala_meta_tags() {
    if (is_single() || is_page()) {
        global $post;
        if (has_post_thumbnail($post->ID)) {
            $image = wp_get_attachment_image_src(get_post_thumbnail_id($post->ID), 'large');
            echo '<meta property="og:image" content="' . $image[0] . '">';
        }
        echo '<meta property="og:title" content="' . get_the_title() . '">';
        echo '<meta property="og:description" content="' . get_the_excerpt() . '">';
        echo '<meta property="og:url" content="' . get_permalink() . '">';
    }
}
add_action('wp_head', 'idade_fala_meta_tags');
?>