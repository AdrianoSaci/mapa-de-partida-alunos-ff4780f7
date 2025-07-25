<?php get_header(); ?>

<main class="site-main">
    <div class="container">
        <div class="content-area">
            <div class="card text-center">
                <h1 style="font-size: 4rem; color: #2563eb; margin-bottom: 1rem;">404</h1>
                <h2>Página não encontrada</h2>
                <p class="text-muted mb-2">
                    Desculpe, a página que você está procurando não existe ou foi movida.
                </p>
                
                <div class="mb-2">
                    <a href="<?php echo home_url(); ?>" class="btn">
                        🏠 Voltar ao Início
                    </a>
                </div>
                
                <!-- Formulário de busca -->
                <div class="search-form mt-2">
                    <h3>Que tal fazer uma busca?</h3>
                    <?php get_search_form(); ?>
                </div>
                
                <!-- Posts recentes -->
                <div class="recent-posts mt-2">
                    <h3>Posts Recentes</h3>
                    <?php
                    $recent_posts = new WP_Query(array(
                        'posts_per_page' => 5,
                        'post_status' => 'publish'
                    ));
                    
                    if ($recent_posts->have_posts()) :
                        echo '<ul style="list-style: none; padding: 0;">';
                        while ($recent_posts->have_posts()) : $recent_posts->the_post();
                            echo '<li style="margin-bottom: 0.5rem;">';
                            echo '<a href="' . get_permalink() . '" style="color: #2563eb; text-decoration: none;">';
                            echo '📄 ' . get_the_title();
                            echo '</a>';
                            echo '</li>';
                        endwhile;
                        echo '</ul>';
                        wp_reset_postdata();
                    endif;
                    ?>
                </div>
                
                <!-- Categorias principais -->
                <?php
                $categories = get_categories(array(
                    'orderby' => 'count',
                    'order' => 'DESC',
                    'number' => 5,
                    'hide_empty' => true
                ));
                
                if ($categories) : ?>
                    <div class="main-categories mt-2">
                        <h3>Categorias Principais</h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center;">
                            <?php foreach ($categories as $category) : ?>
                                <a href="<?php echo get_category_link($category->term_id); ?>" 
                                   class="btn btn-secondary">
                                    📂 <?php echo $category->name; ?> (<?php echo $category->count; ?>)
                                </a>
                            <?php endforeach; ?>
                        </div>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</main>

<?php get_footer(); ?>