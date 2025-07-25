<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php wp_title('|', true, 'right'); ?><?php bloginfo('name'); ?></title>
    <meta name="description" content="<?php bloginfo('description'); ?>">
    
    <!-- PWA Meta Tags -->
    <meta name="theme-color" content="#2563eb">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="Idade de Fala">
    
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
    <header class="site-header">
        <div class="container">
            <h1 class="site-title">
                <a href="<?php echo home_url(); ?>" style="color: white; text-decoration: none;">
                    <?php bloginfo('name'); ?>
                </a>
            </h1>
            <p class="site-description"><?php bloginfo('description'); ?></p>
            
            <nav class="main-navigation">
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'menu_class' => 'main-menu',
                    'container' => false,
                    'fallback_cb' => 'default_menu'
                ));
                
                function default_menu() {
                    echo '<ul>';
                    echo '<li><a href="' . home_url() . '">Início</a></li>';
                    echo '<li><a href="' . home_url('/avaliacao') . '">Avaliação</a></li>';
                    echo '<li><a href="' . home_url('/sobre') . '">Sobre</a></li>';
                    echo '<li><a href="' . home_url('/contato') . '">Contato</a></li>';
                    echo '</ul>';
                }
                ?>
            </nav>
        </div>
    </header>