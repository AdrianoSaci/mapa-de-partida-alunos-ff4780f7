<?php get_header(); ?>

<main class="site-main">
    <div class="container">
        <div class="content-area">
            <?php while (have_posts()) : the_post(); ?>
                <article class="page fade-in">
                    <header class="page-header">
                        <h1 class="post-title"><?php the_title(); ?></h1>
                        <?php if (get_the_modified_date() != get_the_date()) : ?>
                            <div class="post-meta">
                                <span>📅 Publicado em <?php echo get_the_date(); ?></span>
                                <span>🔄 Atualizado em <?php echo get_the_modified_date(); ?></span>
                            </div>
                        <?php else : ?>
                            <div class="post-meta">
                                <span>📅 Publicado em <?php echo get_the_date(); ?></span>
                            </div>
                        <?php endif; ?>
                    </header>
                    
                    <?php if (has_post_thumbnail()) : ?>
                        <div class="page-thumbnail mb-2">
                            <?php the_post_thumbnail('large', array('class' => 'img-responsive')); ?>
                        </div>
                    <?php endif; ?>
                    
                    <div class="page-content">
                        <?php the_content(); ?>
                        
                        <?php
                        wp_link_pages(array(
                            'before' => '<div class="page-links text-center mt-2">',
                            'after' => '</div>',
                            'link_before' => '<span class="btn btn-secondary" style="margin: 0 5px;">',
                            'link_after' => '</span>',
                        ));
                        ?>
                    </div>
                </article>
                
                <!-- Páginas filhas (se existirem) -->
                <?php
                $child_pages = get_pages(array(
                    'parent' => $post->ID,
                    'sort_column' => 'menu_order',
                    'sort_order' => 'ASC'
                ));
                
                if ($child_pages) : ?>
                    <div class="child-pages mt-2">
                        <h3>Subpáginas</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                            <?php foreach ($child_pages as $child) : ?>
                                <div class="card">
                                    <h4 class="card-title">
                                        <a href="<?php echo get_permalink($child->ID); ?>">
                                            <?php echo $child->post_title; ?>
                                        </a>
                                    </h4>
                                    <?php if ($child->post_excerpt) : ?>
                                        <p><?php echo $child->post_excerpt; ?></p>
                                    <?php else : ?>
                                        <p><?php echo wp_trim_words($child->post_content, 20); ?></p>
                                    <?php endif; ?>
                                    <a href="<?php echo get_permalink($child->ID); ?>" class="btn">
                                        Ler mais
                                    </a>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                <?php endif; ?>
                
                <!-- Comentários (se habilitados para páginas) -->
                <?php if (comments_open() || get_comments_number()) : ?>
                    <div class="comments-section mt-2">
                        <?php comments_template(); ?>
                    </div>
                <?php endif; ?>
                
            <?php endwhile; ?>
        </div>
    </div>
</main>

<?php get_footer(); ?>