<?php get_header(); ?>

<main class="site-main">
    <div class="container">
        <div class="content-area">
            <?php while (have_posts()) : the_post(); ?>
                <article class="post fade-in">
                    <header class="post-header">
                        <h1 class="post-title"><?php the_title(); ?></h1>
                        <div class="post-meta">
                            <span>📅 <?php echo get_the_date(); ?></span>
                            <span>👤 <?php the_author(); ?></span>
                            <?php if (has_category()) : ?>
                                <span>📂 <?php the_category(', '); ?></span>
                            <?php endif; ?>
                            <?php if (has_tag()) : ?>
                                <span>🏷️ <?php the_tags('', ', ', ''); ?></span>
                            <?php endif; ?>
                        </div>
                    </header>
                    
                    <?php if (has_post_thumbnail()) : ?>
                        <div class="post-thumbnail mb-2">
                            <?php the_post_thumbnail('large', array('class' => 'img-responsive')); ?>
                        </div>
                    <?php endif; ?>
                    
                    <div class="post-content">
                        <?php the_content(); ?>
                    </div>
                    
                    <?php if (has_tag()) : ?>
                        <div class="post-tags mt-2">
                            <strong>Tags:</strong> <?php the_tags('', ', ', ''); ?>
                        </div>
                    <?php endif; ?>
                </article>
                
                <!-- Navegação entre posts -->
                <nav class="post-navigation mt-2">
                    <div style="display: flex; justify-content: space-between; gap: 1rem;">
                        <?php
                        $prev_post = get_previous_post();
                        $next_post = get_next_post();
                        ?>
                        
                        <?php if ($prev_post) : ?>
                            <div class="nav-previous">
                                <a href="<?php echo get_permalink($prev_post->ID); ?>" class="btn btn-secondary">
                                    ← <?php echo $prev_post->post_title; ?>
                                </a>
                            </div>
                        <?php endif; ?>
                        
                        <?php if ($next_post) : ?>
                            <div class="nav-next">
                                <a href="<?php echo get_permalink($next_post->ID); ?>" class="btn btn-secondary">
                                    <?php echo $next_post->post_title; ?> →
                                </a>
                            </div>
                        <?php endif; ?>
                    </div>
                </nav>
                
                <!-- Posts relacionados -->
                <?php idade_fala_related_posts(); ?>
                
                <!-- Comentários -->
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