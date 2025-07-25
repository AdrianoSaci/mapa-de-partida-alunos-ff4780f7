<?php get_header(); ?>

<main class="site-main">
    <div class="container">
        <div class="content-area">
            <header class="page-header mb-2">
                <h1>Resultados da Busca</h1>
                <?php if (have_posts()) : ?>
                    <p class="text-muted">
                        <?php printf('Encontramos %d resultado(s) para: <strong>"%s"</strong>', 
                                   $wp_query->found_posts, 
                                   get_search_query()); ?>
                    </p>
                <?php else : ?>
                    <p class="text-muted">
                        Nenhum resultado encontrado para: <strong>"<?php echo get_search_query(); ?>"</strong>
                    </p>
                <?php endif; ?>
                
                <!-- Formulário de busca refinada -->
                <div class="search-form card">
                    <h3>Refinar busca</h3>
                    <?php get_search_form(); ?>
                </div>
            </header>
            
            <?php if (have_posts()) : ?>
                <div class="search-results">
                    <?php while (have_posts()) : the_post(); ?>
                        <article class="post search-result fade-in">
                            <h2 class="post-title">
                                <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                            </h2>
                            
                            <div class="post-meta">
                                <span>📅 <?php echo get_the_date(); ?></span>
                                <span>👤 <?php the_author(); ?></span>
                                <span>📂 <?php echo get_post_type_object(get_post_type())->labels->singular_name; ?></span>
                                <?php if (has_category()) : ?>
                                    <span>🏷️ <?php the_category(', '); ?></span>
                                <?php endif; ?>
                            </div>
                            
                            <div class="post-content">
                                <?php 
                                $excerpt = get_the_excerpt();
                                $search_term = get_search_query();
                                
                                // Destacar o termo da busca no excerpt
                                if ($search_term) {
                                    $excerpt = preg_replace('/(' . preg_quote($search_term, '/') . ')/i', 
                                                          '<mark style="background: #fef3c7; padding: 2px 4px; border-radius: 3px;">$1</mark>', 
                                                          $excerpt);
                                }
                                
                                echo $excerpt;
                                ?>
                                <div class="mt-1">
                                    <a href="<?php the_permalink(); ?>" class="btn">Ler mais</a>
                                </div>
                            </div>
                        </article>
                    <?php endwhile; ?>
                    
                    <!-- Paginação -->
                    <div class="text-center mt-2">
                        <?php 
                        echo paginate_links(array(
                            'prev_text' => '← Anterior',
                            'next_text' => 'Próximo →',
                            'type' => 'list'
                        )); 
                        ?>
                    </div>
                </div>
                
            <?php else : ?>
                <div class="no-results">
                    <div class="card text-center">
                        <h2>🔍 Nenhum resultado encontrado</h2>
                        <p>Tente algumas dessas sugestões:</p>
                        <ul style="list-style: none; padding: 0;">
                            <li>✓ Verifique se todas as palavras estão escritas corretamente</li>
                            <li>✓ Tente palavras-chave diferentes</li>
                            <li>✓ Tente termos mais gerais</li>
                            <li>✓ Use menos palavras na busca</li>
                        </ul>
                        
                        <div class="mt-2">
                            <a href="<?php echo home_url(); ?>" class="btn">
                                🏠 Voltar ao Início
                            </a>
                        </div>
                    </div>
                    
                    <!-- Posts populares como sugestão -->
                    <?php
                    $popular_posts = new WP_Query(array(
                        'posts_per_page' => 6,
                        'meta_key' => 'post_views_count',
                        'orderby' => 'meta_value_num',
                        'order' => 'DESC',
                        'post_status' => 'publish'
                    ));
                    
                    if ($popular_posts->have_posts()) :
                    ?>
                        <div class="suggested-posts mt-2">
                            <h3 class="text-center">Posts Populares</h3>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
                                <?php while ($popular_posts->have_posts()) : $popular_posts->the_post(); ?>
                                    <div class="card">
                                        <h4 class="card-title">
                                            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                                        </h4>
                                        <p><?php echo wp_trim_words(get_the_excerpt(), 15); ?></p>
                                        <a href="<?php the_permalink(); ?>" class="btn">Ler mais</a>
                                    </div>
                                <?php endwhile; ?>
                            </div>
                        </div>
                    <?php 
                        wp_reset_postdata();
                    endif; 
                    ?>
                </div>
            <?php endif; ?>
        </div>
    </div>
</main>

<?php get_footer(); ?>