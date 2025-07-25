<?php get_header(); ?>

<main class="site-main">
    <div class="container">
        <div class="content-area">
            <h1 class="text-center mb-2">Idade de Fala - Avaliação de Comunicação Infantil</h1>
            <p class="text-center text-muted mb-2">Aplicativo para avaliação da idade de comunicação de crianças</p>
            
            <?php if (have_posts()) : ?>
                <?php while (have_posts()) : the_post(); ?>
                    <article class="post fade-in">
                        <h2 class="post-title">
                            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                        </h2>
                        
                        <div class="post-meta">
                            Publicado em <?php echo get_the_date(); ?> por <?php the_author(); ?>
                            <?php if (has_category()) : ?>
                                | Categoria: <?php the_category(', '); ?>
                            <?php endif; ?>
                        </div>
                        
                        <div class="post-content">
                            <?php if (is_home() || is_front_page()) : ?>
                                <?php the_excerpt(); ?>
                                <a href="<?php the_permalink(); ?>" class="btn">Ler mais</a>
                            <?php else : ?>
                                <?php the_content(); ?>
                            <?php endif; ?>
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
                
            <?php else : ?>
                <div class="card text-center">
                    <h2>Nenhum conteúdo encontrado</h2>
                    <p>Desculpe, não há posts para exibir no momento.</p>
                </div>
            <?php endif; ?>
        </div>
    </div>
</main>

<?php get_footer(); ?>